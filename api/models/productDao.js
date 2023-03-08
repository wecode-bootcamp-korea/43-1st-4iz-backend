const dataSource = require("./dataSource");
const queryRunner = dataSource.createQueryRunner();

const createProduct = async (
  name,
  price,
  gender,
  description,
  image,
  is_new,
  discountRate,
  releaseDate,
  color,
  size,
  quantity,
  category,
  subcategory
) => {
  await queryRunner.connect();

  try {
    // Products
    await queryRunner.query(
      `INSERT 
       INTO products (
        name, 
        price, 
        gender, 
        description, 
        image, 
        is_new, 
        discountRate, 
        releaseDate,
        category
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        price,
        gender,
        description,
        image,
        is_new,
        discountRate,
        releaseDate,
        category,
      ]
    );

    const productId = await queryRunner.query(
      `SELECT id 
       FROM products 
       WHERE name = ?`,
      [name]
    );

    // Product-Options
    await queryRunner.query(
      `
      INSERT
      INTO product_options (
        product_id,
        color,
        size,
        quantity
      ) VALUES (?, ?, ?, ?)`,
      [productId, color, size, quantity]
    );

    // Subcategories
    await queryRunner.query(
      `
        INSERT 
        INTO subcategories (
          name
        ) VALUES (?)`,
      [subcategory]
    );

    const subcategoryId = await queryRunner.query(
      `SELECT id
      FROM subcategories
      WHERE name = ?`,
      [subcategory]
    );

    // Product-Subcategories
    await queryRunner.query(
      `
      INSERT
      INTO product_subcategories (
        product_id,
        subcategory_id
      ) VALUES (?, ?)
    `,
      [productId, subcategoryId]
    );

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};

module.exports = {
  createProduct,
};
