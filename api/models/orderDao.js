const crypto = require("crypto");
const dataSource = require("./dataSource");

const queryRunner = dataSource.createQueryRunner();

const generateRandomNumber = async (type) => {
  const randomBytes = crypto.randomBytes(8);
  const hexString = randomBytes.toString("hex");
  let randomString = `${hexString.substr(0, 4)}-${hexString.substr(
    4,
    4
  )}-${hexString.substr(8, 4)}-${hexString.substr(12, 4)}`;

  switch (type) {
    case "order":
      randomString = "ORDER-" + randomString;
      break;
    case "shipment":
      randomString = "SHIPMENT-" + randomString;
      break;
    case "payment":
      randomString = "PAYMENT-" + randomString;
      break;
  }

  return randomString;
};

const createOrder = async (
  userId,
  name,
  street,
  address,
  zipcode,
  phoneNumber,
  email
) => {
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const carts = await queryRunner.query(
      `
      SELECT
        id,
        option_id,
        price_sum,
        quantity
      FROM carts
      WHERE user_id = ?  
    `,
      [userId]
    );

    carts.forEach(async (cart) => {
      const orderNumber = await generateRandomNumber("order");

      const order = await queryRunner.query(
        `
        INSERT
        INTO orders (
          user_id,
          status_id,
          option_id,
          detail,
          order_number
        ) VALUES (?, ?, ?, ?, ?)
      `,
        [userId, 1, cart.option_id, `order ${cart.id}`, orderNumber]
      );

      const [productCart] = await queryRunner.query(
        `
          SELECT product_id
          FROM product_carts
          WHERE cart_id = ?
        `,
        [cart.id]
      );

      await queryRunner.query(
        `
          INSERT
          INTO product_orders (
            product_id,
            order_id,
            price_sum,
            quantity
          ) VALUES (? ,? ,?, ?)
        `,
        [productCart.product_id, order.insertId, cart.price_sum, cart.quantity]
      );

      const shipmentNumber = await generateRandomNumber("shipment");

      await queryRunner.query(
        `
          INSERT
          INTO shipment (
            order_id,
            name,
            street,
            address,
            zipcode,
            phone_number,
            email,
            detail,
            tracking_number
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          order.insertId,
          name,
          street,
          address,
          zipcode,
          phoneNumber,
          email,
          `shipment ${cart.id}`,
          shipmentNumber,
        ]
      );

      const paymentNumber = await generateRandomNumber("payment");

      await queryRunner.query(
        `
        INSERT
        INTO payment (
          order_id,
          amount,
          payment_number,
          payment_method
        ) VALUES (?, ?, ?, ?)
      `,
        [
          order.insertId,
          cart.price_sum,
          paymentNumber,
          `payment_method ${cart.id}`,
        ]
      );

      const [option] = await queryRunner.query(
        `
        SELECT quantity
        FROM options
        WHERE id = ?
      `,
        [cart.option_id]
      );

      const updatedRows = (
        await queryRunner.query(
          `
        UPDATE options
        SET quantity = ?
        WHERE id = ?
      `,
          [option.quantity - cart.quantity, cart.option_id]
        )
      ).affectedRows;

      if (updatedRows !== 1) {
        throw new Error("WRONG_NUMBER_OF_RECORDS_UPDATED");
      }

      let deletedRows = (
        await queryRunner.query(
          `
          DELETE
          FROM product_carts
          WHERE product_id = ? AND cart_id = ?
        `,
          [productCart.product_id, cart.id]
        )
      ).affectedRows;

      if (deletedRows !== 0 && deletedRows !== 1) {
        throw new Error("WRONG_NUMBER_OF_RECORDS_DELETED");
      }

      deletedRows = (
        await dataSource.query(
          `
        DELETE
        FROM carts
        WHERE user_id = ? AND id = ?  
      `,
          [userId, cart.id]
        )
      ).affectedRows;

      if (deletedRows !== 0 && deletedRows !== 1) {
        throw new Error("WRONG_NUMBER_OF_RECORDS_DELETED");
      }
    });

    await queryRunner.commitTransaction();
  } catch (error) {
    console.error(
      "Error occurred during transaction. Rollback triggered.",
      error
    );
    await queryRunner.rollbackTransaction();
  }
};

module.exports = {
  createOrder,
};
