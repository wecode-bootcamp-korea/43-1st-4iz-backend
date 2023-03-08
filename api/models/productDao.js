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
  await queryRunner.startTransaction();

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
        discount_rate, 
        release_date,
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

    let [productId] = await queryRunner.query(
      `SELECT id 
       FROM products 
       WHERE name = ?`,
      [name]
    );

    productId = parseInt(productId.id);

    // Product-Options
    await queryRunner.query(
      `
      INSERT
      INTO product_options (
        product_id,
        color_name,
        size_name,
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

    let [subcategoryId] = await queryRunner.query(
      `SELECT id
      FROM subcategories
      WHERE name = ?`,
      [subcategory]
    );

    subcategoryId = parseInt(subcategoryId.id);

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
    console.error("Rollback triggered", error);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};

module.exports = {
  createProduct,
};
