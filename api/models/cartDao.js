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

const deleteCart = async (userId, cartId, productId) => {
  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();
    const deletedRowsFromProductCarts = (
      await queryRunner.query(
        `
        DELETE
        FROM product_carts
        WHERE product_id = ? AND cart_id = ?
      `,
        [productId, cartId]
      )
    ).affectedRows;

    if (deletedRowsFromProductCarts !== 1) {
      throw new Error("INVALID_INPUT");
    }

    const deletedRowFromCarts = (
      await queryRunner.query(
        `
      DELETE
      FROM carts
      WHERE user_id = ? AND id = ?  
    `,
        [userId, cartId]
      )
    ).affectedRows;

    if (deletedRowFromCarts !== 1) {
      throw new Error("INVALID_INPUT");
    }

    await queryRunner.commitTransaction();

    return deletedRowFromCarts;
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
  deleteCart,
};
