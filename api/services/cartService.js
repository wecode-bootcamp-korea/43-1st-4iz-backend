const { cartDao } = require("../models");

const listCart = async (userId) => {
  return await cartDao.listCart(userId);
};

module.exports = {
  listCart,
};
