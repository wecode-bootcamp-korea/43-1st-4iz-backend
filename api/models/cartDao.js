const dataSource = require("./dataSource");

const getCarts = async (userId) => {
  return await dataSource.query(
    `
    SELECT 
      p.id AS id,
      p.name AS name,
      c.price_sum AS price_sum,
      IF(p.discount_rate > 0, c.price_sum * (1 - p.discount_rate / 100) , "") AS discounted_price_sum,
      c.quantity AS quantity,
      pcj.category AS categories,
      o.color AS color,
      o.size AS size,
      oj.available_options AS available_options
    FROM carts AS c
    JOIN users AS u ON u.id = c.user_id
    JOIN product_carts AS pc on pc.cart_id = c.id
    JOIN products AS p ON p.id = pc.product_id
    JOIN options AS o ON o.id = c.option_id
    JOIN (
      SELECT  
        product_id,
        JSON_ARRAYAGG(c.name) AS category
      FROM product_categories AS pc
      JOIN categories AS c ON c.id = pc.category_id
      GROUP BY product_id
    ) pcj ON pcj.product_id = p.id
    JOIN (
      SELECT
        product_id,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "available_colors", o.color,
            "available_sizes", o.size,
            "available_quantities", o.quantity
          )
        ) AS available_options
      FROM options AS o
      GROUP BY product_id
    ) oj ON oj.product_id = p.id
  `,
    [userId]
  );
};

module.exports = {
  getCarts,
};
