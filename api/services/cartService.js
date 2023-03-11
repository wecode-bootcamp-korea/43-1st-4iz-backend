const { cartDao } = require("../models");

const deleteCart = async (userId, cartId, productId) => {
  return await cartDao.deleteCart(userId, cartId, productId);
};

module.exports = {
  deleteCart,
};
