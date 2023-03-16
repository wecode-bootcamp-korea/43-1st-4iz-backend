const { cartDao } = require("../models");
const { checkIfUserExistById } = require("../models/userDao");
const { checkIfCartExistsById } = require("../models/cartDao");
const { checkIfProductExistsById } = require("../models/productDao");
const { validateQuantity } = require("../utils/validation");

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

const createCart = async (userId, productId, color, size, quantity) => {
  const result = await checkIfProductExistsById(productId);

  if (!result) {
    const error = new Error("NO_SUCH_PRODUCT");
    error.statusCode = 404;

    throw error;
  }

  await validateQuantity(quantity);

  color = color.replaceAll('"', "");
  size = size.replaceAll('"', "");

  return await cartDao.createCart(userId, productId, color, size, quantity);
};

const listCart = async (userId) => {
  return await cartDao.listCart(userId);
};

const updateCart = async (userId, cartId, productId, quantity) => {
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

  await validateQuantity(quantity);

  return await cartDao.updateCart(userId, cartId, productId, quantity);
};

const deleteCart = async (userId, cartId, productId) => {
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
