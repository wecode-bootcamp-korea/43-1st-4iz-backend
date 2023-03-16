const dataSource = require("./dataSource");
const queryRunner = dataSource.createQueryRunner();
const { ProductQueryBuilder } = require("./productQueryBuilder");

const parseOptionArray = (color, size, options) => {
  options.forEach((option) => {
    color.push(option.color);
    size.push(option.size);
  });
};

const removeDuplicates = (array) => {
  return array.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
};

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

const listProduct = async (limit, offset, search, sort, filters) => {
  const filterQuery = new ProductQueryBuilder(
    limit,
    offset,
    search,
    sort,
    filters
  ).build();

  return await dataSource.query(
    `
    SELECT
      p.id AS id,
      p.name AS name,
      p.price AS price,
      IF(p.discount_rate > 0, p.price * (1 - p.discount_rate / 100) , "") AS discounted_price,
      p.gender,
      IF(p.is_new = 1, "신상품", "") AS new,
      COUNT(DISTINCT(o.color)) AS color_count,
      p.discount_rate AS discount_rate,
      DATE_FORMAT(p.release_date, "%Y-%m-%d") AS release_date,
      ij.url AS images,
      pcj.category AS categories
    FROM products AS p
    JOIN options AS o ON o.product_id = p.id
    JOIN (
      SELECT 
        product_id,
        JSON_ARRAYAGG(i.url) AS url
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
    ${filterQuery}
  `
  );
};

const checkIfProductExistsById = async (productId) => {
  const [result] = await dataSource.query(
    `
    SELECT EXISTS(
      SELECT id 
      FROM products 
      WHERE id = ?
    ) AS value
  `,
    [productId]
  );

  return !!parseInt(result.value);
};

const getProductDetailById = async (productId) => {
  return await dataSource.query(
    `
    SELECT
      p.id AS id,
      p.name AS name,
      p.price AS price,
      p.description AS description,
      IF(p.discount_rate > 0, p.price * (1 - p.discount_rate / 100) , "") AS discounted_price,
      p.gender AS gender,
      IF(p.is_new = 1, "신상품", "") AS new,
      p.discount_rate AS discount_rate,
      DATE_FORMAT(p.release_date, "%Y-%m-%d") AS release_date,
      ij.url AS images,
      pcj.category AS categories,
      oj.options AS options
    FROM products AS p
    JOIN (
      SELECT
        product_id,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "color", o.color,
            "size", o.size
          )
        ) AS options
      FROM options AS o
      GROUP BY product_id
    ) oj ON oj.product_id = p.id
    JOIN (
      SELECT 
        product_id,
        JSON_ARRAYAGG(i.url) AS url
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
    WHERE p.id = ?`,
    [productId]
  );
};

const getRecommendation = async (productId) => {
  const [product] = await getProductDetailById(productId);

  const filter = {};
  const color = [];
  const size = [];

  Object.entries(product).forEach(([key, value]) => {
    switch (key) {
      case "gender":
        filter.gender = value;
        break;
      case "categories":
        filter.category = value;
        break;
      case "options":
        parseOptionArray(color, size, value);
        filter.color = removeDuplicates(color);
        filter.size = removeDuplicates(size);
        break;
    }
  });

  return await dataSource.query(
    `
    SELECT
      p.id AS id,
      p.name AS name,
      p.price AS price,
      IF(p.discount_rate > 0, p.price * (1 - p.discount_rate / 100) , "") AS discounted_price,
    CASE
      WHEN p.gender = "M" THEN "남성"
      WHEN p.gender = "W" THEN "여성"
      ELSE ""
    END AS gender,
      IF(p.is_new = 1, "신상품", "") AS new,
      COUNT(DISTINCT(o.color)) AS color_count,
      p.discount_rate AS discount_rate,
      DATE_FORMAT(p.release_date, "%Y-%m-%d") AS release_date,
      ij.url AS images,
      pcj.category AS categories
    FROM products AS p
    JOIN options AS o ON o.product_id = p.id
    JOIN (
      SELECT 
        product_id,
        JSON_ARRAYAGG(i.url) AS url
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
    WHERE p.id != ? AND(p.gender = ? OR o.size IN (?) OR o.color IN (?) OR category IN (?))
    GROUP BY p.id
  `,
    [productId, filter.gender, filter.size, filter.color, filter.category]
  );
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
  listProduct,
  checkIfProductExistsById,
  getProductDetailById,
  getRecommendation,
  getProductById,
};
