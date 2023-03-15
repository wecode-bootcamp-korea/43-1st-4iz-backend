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

const getProductDetailById = async (productId) => {
  return await productDao.getProductDetailById(productId);
};

const listProduct = async (limit, offset, search, sort, filters) => {
  if (filters.hasOwnProperty("category")) {
    let value = filters["category"];
    value = value.replaceAll('"', "");
    filters["category"] = value;
  }

  search = search.replaceAll('"', "");
  sort = sort.replaceAll('"', "");

  return await productDao.listProduct(limit, offset, search, sort, filters);
};

module.exports = {
  createProduct,
  listProduct,
  getProductDetailById,
};
