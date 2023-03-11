const dataSource = require("./dataSource");

const updateCart = async (userId, cartId, productId, quantity) => {
  const [product] = await dataSource.query(
    `
    SELECT price
    FROM products
    WHERE id = ?
  `,
    [productId]
  );

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
    throw new Error("WRONG_NUMBER_OF_RECORDS_UPDATED");
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
  updateCart,
};
