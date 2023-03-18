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
    const [total] = await queryRunner.query(
      `
      SELECT
        SUM(price_sum) AS price,
        SUM(quantity) AS quantity
      FROM carts
      WHERE user_id = ?
    `,
      [userId]
    );

    const orderNumber = await generateRandomString("order");
    const order = await queryRunner.query(
      `
        INSERT
        INTO orders (
          user_id,
          total_price,
          total_quantity,
          order_number
        ) VALUES (?, ?, ?, ?)
      `,
      [userId, total.price, total.quantity, orderNumber]
    );

    const orderId = order.insertId;

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
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ? ,?)
      `,
      [
        orderId,
        name,
        street,
        address,
        zipcode,
        phoneNumber,
        email,
        "shipment",
        shipmentNumber,
      ]
    );

    const paymentNumber = await generateRandomString("payment");
    const payment = await queryRunner.query(
      `
      INSERT
      INTO payment (
        order_id,
        amount,
        payment_number,
        payment_method
      ) VALUES (?, ?, ?, ?)
    `,
      [orderId, total.price, paymentNumber, paymentMethod.KAKAO_PAY]
    );

    const carts = await queryRunner.query(
      `
      SELECT
        id,
        option_id,
        price_sum,
        quantity
      FROM carts
      WHERE user_id = ?
      ORDER BY id
    `,
      [userId]
    );

    const cartIds = carts.map((cart) => {
      return cart.id;
    });

    const optionIds = carts.map((cart) => {
      return cart.option_id;
    });

    const cartPriceSums = carts.map((cart) => {
      return cart.price_sum;
    });

    const cartQuantities = carts.map((cart) => {
      return cart.quantity;
    });

    const productObjects = await queryRunner.query(
      `
      SELECT
        pc.product_id
      FROM product_carts AS pc
      WHERE pc.cart_id IN (?)
      ORDER BY pc.cart_id
    `,
      [cartIds]
    );

    const productQuantityObjects = await queryRunner.query(
      `
      SELECT
        quantity
      FROM options
      WHERE id IN (?)
      ORDER BY FIELD(id, ?)
      `,
      [optionIds, optionIds]
    );

    const productIdArray = productObjects.map((productObj) => {
      return productObj.product_id;
    });

    const productQuantityArray = productQuantityObjects.map(
      (producytQuantityObj) => {
        return producytQuantityObj.quantity;
      }
    );

    for (let i = 0; i < cartIds.length; i++) {
      await queryRunner.query(
        `
        INSERT
        INTO product_orders (
          product_id,
          order_id,
          option_id
        ) VALUES (?, ?, ?)
      `,
        [productIdArray[i], orderId, optionIds[i]]
      );

      await queryRunner.query(
        `
        INSERT
        INTO order_details (
          order_id,
          status_id,
          price_sum,
          quantity
        ) VALUES (?, ?, ?, ?)
      `,
        [orderId, orderStatusEnum.FILLED, cartPriceSums[i], cartQuantities[i]]
      );
    }

    for (let i = 0; i < cartIds.length; i++) {
      const updatedRows = (
        await queryRunner.query(
          `
          UPDATE options
          SET quantity = ?
          WHERE id = ?
        `,
          [productQuantityArray[i] - cartQuantities[i], optionIds[i]]
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
          [productIdArray[i], cartIds[i]]
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
          [userId, cartIds[i]]
        )
      ).affectedRows;

      if (deletedRowsFromCarts !== 1) {
        throw new Error("INVALID_INPUT");
      }
    }
    await queryRunner.commitTransaction();
    return orderId;
  } catch (err) {
    console.error(
      "Error occurred during transaction. Rollback triggered.",
      err
    );
    await queryRunner.rollbackTransaction();

    const error = new Error("INVALID_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createOrder,
};
