const { productDao } = require("../models");
const {
  validatePrice,
  validateIsNew,
  validateDiscountRate,
  validateQuantity,
  validateGender,
} = require("../utils/validation");

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
  await validatePrice(price);
  await validateGender(gender);
  await validateIsNew(isNew);
  await validateDiscountRate(discountRate);
  await validateQuantity(quantity);

  return await productDao.createProduct(
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
  );
};

const searchProduct = async (
  limit,
  offset,
  searchMethod,
  sortMethod,
  filterOptions
) => {
  const sorting = async (sortMethod) => {
    switch (sortMethod) {
      case "date":
        return `ORDER BY p.release_date DESC`;
      case "high":
        return `ORDER BY p.price DESC`;
      case "low":
        return `ORDER BY p.price ASC`;
      default:
        return `ORDER BY p.release_date DESC`;
    }
  };

  const sortingQuery = await sorting(sortMethod);
  return await productDao.searchProduct(
    limit,
    offset,
    searchMethod,
    sortingQuery,
    filterOptions
  );
};

module.exports = {
  createProduct,
  searchProduct,
};
