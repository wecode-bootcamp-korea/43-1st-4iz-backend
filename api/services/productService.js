const { productDao } = require("../models");
const {
  validatePrice,
  validateIsNew,
  validateDiscountRate,
  validateQuantity,
  validateGender,
  validateOrder,
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

const sortProduct = async (order) => {
  await validateOrder(order);

  return await productDao.sortProduct(order);
};

module.exports = {
  createProduct,
  sortProduct,
};
