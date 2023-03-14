const { cartDao } = require("../models");
const { validateQuantity } = require("../utils/validation");

const createCart = async (userId, productId, color, size, quantity) => {
  await validateQuantity(quantity);

  color = color.replaceAll('"', "");
  size = size.replaceAll('"', "");

  return await cartDao.createCart(userId, productId, color, size, quantity);
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
  updateCart,
  deleteCart,
};
