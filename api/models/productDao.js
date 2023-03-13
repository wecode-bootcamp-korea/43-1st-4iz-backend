const dataSource = require("./dataSource");
const queryRunner = dataSource.createQueryRunner();

const createProduct = async (
  name,
  price,
  gender,
  description,
  image,
  isNew,
  discountRate,
  releaseDate,
  color,
  size,
  quantity,
  category
) => {
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const newProduct = await queryRunner.query(
      `INSERT 
      INTO products (
        name, 
        price, 
        gender, 
        description, 
        is_new, 
        discount_rate, 
        release_date
       ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, price, gender, description, isNew, discountRate, releaseDate]
    );

    await queryRunner.query(
      `
      INSERT 
      INTO images (
        product_id,
        url
      ) VALUES (? ,?)
      `,
      [newProduct.insertId, image]
    );

    await queryRunner.query(
      `
      INSERT 
      INTO options (
        product_id,
        color,
        size,
        quantity
      ) VALUES (?, ?, ?, ?)`,
      [newProduct.insertId, color, size, quantity]
    );

    let [result] = await queryRunner.query(
      `
      SELECT EXISTS( 
        SELECT id 
        FROM categories 
        WHERE name = ?
      ) AS value
      `,
      [category]
    );

    result = !!parseInt(result.value);

    let newCategory;
    if (!result) {
      newCategory = await queryRunner.query(
        `
        INSERT 
        INTO categories (
          name
        ) VALUES (?)`,
        [category]
      );
    }

    await queryRunner.query(
      `
      INSERT
      INTO product_categories (
        product_id,
        category_id
      ) VALUES (?, ?)
    `,
      [newProduct.insertId, newCategory.insertId]
    );

    await queryRunner.commitTransaction();
  } catch (error) {
    console.error(
      "Error occurred during transaction. Rollback triggered.",
      error
    );
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};

const getProductById = async (productId) => {
  return await dataSource.query(
    `
    SELECT price
    FROM products
    WHERE id = ?
  `,
    [productId]
  );
};

module.exports = {
  createProduct,
  getProductById,
};
