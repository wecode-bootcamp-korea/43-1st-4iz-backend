const { cartDao } = require("../models");
const { validateQuantity, validateNumber } = require("../utils/validation");

const createCart = async (userId, productId, color, size, quantity) => {
  await validateNumber(userId);
  await validateNumber(productId);
  await validateQuantity(quantity);

  color = color.replaceAll('"', "");
  size = size.replaceAll('"', "");

  return await cartDao.createCart(userId, productId, color, size, quantity);
};

const listCart = async (userId) => {
  return await cartDao.listCart(userId);
};

const updateCart = async (userId, cartId, productId, quantity) => {
  await validateNumber(userId);
  await validateNumber(productId);
  await validateNumber(cartId);
  await validateQuantity(quantity);

  return await cartDao.updateCart(userId, cartId, productId, quantity);
};

const deleteCart = async (userId, cartId, productId) => {
  await validateNumber(userId);
  await validateNumber(productId);
  await validateNumber(cartId);

  return await cartDao.deleteCart(userId, cartId, productId);
};

module.exports = {
  createCart,
  listCart,
  updateCart,
  deleteCart,
};
