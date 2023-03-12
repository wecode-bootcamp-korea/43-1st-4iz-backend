const { cartDao } = require("../models");
const { validateQuantity } = require("../utils/validation");

const updateCart = async (userId, cartId, productId, quantity) => {
  await validateQuantity(quantity);

  return await cartDao.updateCart(userId, cartId, productId, quantity);
};

module.exports = {
  updateCart,
};
