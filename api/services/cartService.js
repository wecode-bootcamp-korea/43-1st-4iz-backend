const { cartDao } = require("../models");

const getCarts = async (userId) => {
  return cartDao.getCarts(userId);
};

module.exports = {
  getCarts,
};
