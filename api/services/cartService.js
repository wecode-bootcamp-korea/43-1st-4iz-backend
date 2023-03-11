const { cartDao } = require("../models");
const { validateQuantity } = require("../utils/validation");

const createCart = async (userId, productId, color, size, quantity) => {
  await validateQuantity(quantity);

  color = color.replaceAll('"', "");
  size = size.replaceAll('"', "");

  return cartDao.createCart(userId, productId, color, size, quantity);
};

module.exports = {
  createCart,
};