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

const listCart = async (userId) => {
  return await cartDao.listCart(userId);
};

module.exports = {
  createCart,
  updateCart,
  listCart,
};
