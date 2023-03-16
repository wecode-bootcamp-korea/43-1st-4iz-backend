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

const getProductDetailById = async (productId) => {
  await validateNumber(productId);

  const result = await productDao.checkIfProductExistsById(productId);

  if (!result) {
    const error = new Error("NO_SUCH_PRODUCT");
    error.statusCode = 404;

    throw error;
  }

  return await productDao.getProductDetailById(productId);
};

const getRecommendation = async (productId) => {
  await validateNumber(productId);

  const result = await productDao.checkIfProductExistsById(productId);

  if (!result) {
    const error = new Error("NO_SUCH_PRODUCT");
    error.statusCode = 404;

    throw error;
  }

  return await productDao.getRecommendation(productId);
};

module.exports = {
  createProduct,
  listProduct,
  getProductDetailById,
  getRecommendation,
};
