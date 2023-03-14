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

const productInfo = async (productId) => {
    return productDao.getProductDetailByld(productId);
}

module.exports = {
  createProduct,
  productInfo
};