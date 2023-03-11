const dataSource = require("./dataSource");
const queryRunner = dataSource.createQueryRunner();

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

    console.log(`product_carts: ${deletedRows}`);

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
        [userId, cartId]
      )
    ).affectedRows;

    console.log(`carts: ${deletedRows}`);

    if (deletedRows !== 0 && deletedRows !== 1) {
      throw new Error("WRONG_NUMBER_OF_RECORDS_DELETED");
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
  deleteCart,
};
