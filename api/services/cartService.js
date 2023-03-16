const { cartDao } = require("../models");
const { validateQuantity } = require("../utils/validation");

const createCart = async (userId, productId, options) => {
  return await cartDao.createCart(userId, productId, options);
};

const listCart = async (userId) => {
  return await cartDao.listCart(userId);
};

const updateCart = async (userId, cartId, productId, quantity) => {
  await validateQuantity(quantity);

  return await cartDao.updateCart(userId, cartId, productId, quantity);
};

const deleteCart = async (userId, cartId, productId) => {
  return await cartDao.deleteCart(userId, cartId, productId);
};

module.exports = {
  createCart,
  listCart,
  updateCart,
  deleteCart,
};
