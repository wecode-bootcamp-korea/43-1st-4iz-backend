const { cartDao } = require("../models");
const { checkIfCartExistsById } = require("../models/cartDao");
const { checkIfProductExistsById } = require("../models/productDao");
const { validateQuantity, validateNumber } = require("../utils/validation");

const checkIfCartExistsByUserIdAndOptions = async (
  userId,
  productId,
  options
) => {
  const result = await checkIfProductExistsById(productId);

  if (!result) {
    const error = new Error("NO_SUCH_PRODUCT");
    error.statusCode = 404;

    throw error;
  }

  return await cartDao.checkIfCartExistsByUserIdAndOptions(
    userId,
    productId,
    options
  );
};

const createCart = async (userId, productId, options) => {
  const result = await checkIfProductExistsById(productId);

  if (!result) {
    const error = new Error("NO_SUCH_PRODUCT");
    error.statusCode = 404;

    throw error;
  }

  return await cartDao.createCart(userId, productId, options);
};

const listCart = async (userId) => {
  return await cartDao.listCart(userId);
};

const updateCart = async (userId, cartId, productId, quantity) => {
  await validateNumber(productId);
  await validateNumber(cartId);
  await validateQuantity(quantity);

  const cartResult = await checkIfCartExistsById(cartId);
  const productResult = await checkIfProductExistsById(productId);

  if (!cartResult) {
    const error = new Error("NO_SUCH_CART");
    error.statusCode = 404;

    throw error;
  }

  if (!productResult) {
    const error = new Error("NO_SUCH_PRODUCT");
    error.statusCode = 404;

    throw error;
  }

  return await cartDao.updateCart(userId, cartId, productId, quantity);
};

const deleteCart = async (userId, cartId, productId) => {
  await validateNumber(productId);
  await validateNumber(cartId);

  const cartResult = await checkIfCartExistsById(cartId);
  const productResult = await checkIfProductExistsById(productId);

  if (!cartResult) {
    const error = new Error("NO_SUCH_CART");
    error.statusCode = 404;

    throw error;
  }

  if (!productResult) {
    const error = new Error("NO_SUCH_PRODUCT");
    error.statusCode = 404;

    throw error;
  }

  return await cartDao.deleteCart(userId, cartId, productId);
};

module.exports = {
  checkIfCartExistsByUserIdAndOptions,
  createCart,
  listCart,
  updateCart,
  deleteCart,
};
