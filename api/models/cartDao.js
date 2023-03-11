const dataSource = require("./dataSource");
const queryRunner = dataSource.createQueryRunner();

const createCart = async (userId, productId, color, size, quantity) => {
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const [product] = await queryRunner.query(
      `
      SELECT price
      FROM products
      WHERE id = ?
    `,
      [productId]
    );

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

module.exports = {
  createCart,
};
