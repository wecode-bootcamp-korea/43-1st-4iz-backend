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
  await queryRunner.startTransaction();

  try {
    let deletedRows = (
      await queryRunner.query(
        `
        DELETE
        FROM product_carts
        WHERE product_id = ? AND cart_id = ?
      `,
        [productId, cartId]
      )
    ).affectedRows;

    if (deletedRows !== 0 && deletedRows !== 1) {
      throw new Error("INVALID_INPUT");
    }

    deletedRows = (
      await dataSource.query(
        `
      DELETE
      FROM carts
      WHERE user_id = ? AND id = ?  
    `,
        [userId, cartId]
      )
    ).affectedRows;

    if (deletedRows !== 0 && deletedRows !== 1) {
      throw new Error("INVALID_INPUT");
    }

    queryRunner.commitTransaction();
    return deletedRows;
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
