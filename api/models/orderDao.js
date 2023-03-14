const { v4: uuidv4 } = require("uuid");

const dataSource = require("./dataSource");
const { orderStatusEnum, paymentMethod } = require("../utils/enum");

const queryRunner = dataSource.createQueryRunner();

const generateRandomString = async (type) => {
  switch (type) {
    case "order":
      return "ORDER-" + uuidv4();
    case "shipment":
      return "SHIPMENT-" + uuidv4();
    case "payment":
      return "PAYMENT-" + uuidv4();
  }
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
      const orderNumber = await generateRandomString("order");

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
        [
          userId,
          orderStatusEnum.FILLED,
          cart.option_id,
          `order ${cart.id}`,
          orderNumber,
        ]
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

      const shipmentNumber = await generateRandomString("shipment");

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

      const paymentNumber = await generateRandomString("payment");

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
        [order.insertId, cart.price_sum, paymentNumber, paymentMethod.KAKAO_PAY]
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
        throw new Error("INVALID_INPUT");
      }

      const deletedRowsFromProductCarts = (
        await queryRunner.query(
          `
          DELETE
          FROM product_carts
          WHERE product_id = ? AND cart_id = ?
        `,
          [productCart.product_id, cart.id]
        )
      ).affectedRows;

      if (deletedRowsFromProductCarts !== 1) {
        throw new Error("INVALID_INPUT");
      }

      const deletedRowsFromCarts = (
        await queryRunner.query(
          `
        DELETE
        FROM carts
        WHERE user_id = ? AND id = ?  
      `,
          [userId, cart.id]
        )
      ).affectedRows;

      if (deletedRowsFromCarts !== 1) {
        throw new Error("INVALID_INPUT");
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
