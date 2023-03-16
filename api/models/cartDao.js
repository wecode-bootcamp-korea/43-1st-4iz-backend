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

const listCart = async (userId) => {
  return await dataSource.query(
    `
    SELECT
      c.id AS cart_id,
      p.id AS product_id,
      p.name AS name,
      c.price_sum AS price_sum,
      IF(p.discount_rate > 0, c.price_sum * (1 - p.discount_rate / 100) , "") AS discounted_price_sum,
      c.quantity AS quantity,
      ij.image AS images,
      pcj.category AS categories,
      o.color AS color,
      o.size AS size,
      oj.options AS options
    FROM carts AS c
    JOIN users AS u ON u.id = c.user_id
    JOIN product_carts AS pc on pc.cart_id = c.id
    JOIN products AS p ON p.id = pc.product_id
    JOIN options AS o ON o.id = c.option_id
    JOIN (
      SELECT
        product_id,
        JSON_ARRAYAGG(i.url) AS image
      FROM images AS i
      GROUP BY product_id
    ) ij ON ij.product_id = p.id
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
            "color", o.color,
            "size", o.size,
            "quantity", o.quantity
          )
        ) AS options
      FROM options AS o
      GROUP BY product_id
    ) oj ON oj.product_id = p.id
  `,
    [userId]
  );
};
const checkIfCartExistsById = async (cartId) => {
  const [result] = await dataSource.query(
    `
    SELECT EXISTS(
      SELECT id 
      FROM carts 
      WHERE id = ?
    ) AS value
  `,
    [cartId]
  );

  return !!parseInt(result.value);
};

const checkIfCartExistsByUserIdAndOptions = async (
  userId,
  productId,
  options
) => {
  for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
    const optionToArray = options[optionIndex].split("/");
    const color = optionToArray[0];
    const size = optionToArray[1];

    const [option] = await dataSource.query(
      `
      SELECT id 
      FROM options 
      WHERE product_id = ? AND color = ? AND size = ?
      `,
      [productId, color, size]
    );

    if (!option) {
      throw new Error("INVALID_INPUT");
    }

    const [result] = await dataSource.query(
      `
      SELECT EXISTS(
        SELECT id
        FROM carts
        WHERE user_id = ? AND option_id = ?
      ) AS value  
      `,
      [userId, option.id]
    );

    if (!!parseInt(result.value)) {
      return `PRODUCT_WITH_OPTION(COLOR:${color},SIZE:${size})_ALREADY_IN_CART`;
    }
  }

  return "NO_PRODUCT_WITH_SUCH_OPTION_IN_CART";
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
  listCart,
  checkIfCartExistsById,
  checkIfCartExistsByUserIdAndOptions,
  updateCart,
  deleteCart,
};
