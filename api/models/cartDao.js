const dataSource = require("./dataSource");
const { getProductById } = require("./productDao");
const queryRunner = dataSource.createQueryRunner();

const createCart = async (userId, productId, color, size, quantity) => {
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const [product] = await getProductById(productId);

    const [option] = await queryRunner.query(
      `
      SELECT 
        id,
        quantity
      FROM options
      WHERE product_id = ? AND color = ? AND size = ?
    `,
      [productId, color, size]
    );

    const cart = await queryRunner.query(
      `
      INSERT 
      INTO carts (
        user_id,
        option_id,
        quantity,
        price_sum
      ) VALUES (?, ?, ?, ?)
    `,
      [userId, +option.id, quantity, +product.price * quantity]
    );

    await queryRunner.query(
      `
      INSERT 
      INTO product_carts (
        product_id,
        cart_id
      ) VALUES (?, ?)
    `,
      [productId, cart.insertId]
    );

    await queryRunner.commitTransaction();
  } catch (error) {
    console.error(
      "Error occurred during transaction. Rollback triggered.",
      error
    );
    await queryRunner.rollbackTransaction();
  }
};

const updateCart = async (userId, cartId, productId, quantity) => {
  const [product] = await getProductById(productId);

  const updatedRows = (
    await dataSource.query(
      `
    UPDATE carts
    SET 
      quantity = ?,
      price_sum = ?
    WHERE user_id = ? AND id = ?
  `,
      [quantity, +product.price * quantity, userId, cartId]
    )
  ).affectedRows;

  if (updatedRows !== 1) {
    throw new Error("INVALID_INPUT");
  }

  const [result] = await dataSource.query(
    `
    SELECT
      p.name AS name,
      p.price AS price,
      c.quantity AS quantity,
      c.price_sum AS price_sum
    FROM carts AS c
    JOIN product_carts AS pc ON pc.cart_id = c.id
    JOIN products AS p ON p.id = pc.product_id
    WHERE c.user_id = ? AND c.id = ? 
  `,
    [userId, cartId]
  );

  return result;
};

module.exports = {
  createCart,
  updateCart,
};
