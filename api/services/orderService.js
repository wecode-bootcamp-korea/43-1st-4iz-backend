const { orderDao } = require("../models");
const {
  validatePhoneNumber,
  validateEmail,
  validateZipcode,
  validateNumber,
} = require("../utils/validation");

const createOrder = async (
  userId,
  name,
  street,
  address,
  zipcode,
  phoneNumber,
  email
) => {
  await validateZipcode(zipcode);
  await validatePhoneNumber(phoneNumber);
  await validateEmail(email);

  return await orderDao.createOrder(
    userId,
    name,
    street,
    address,
    zipcode,
    phoneNumber,
    email
  );
};

module.exports = {
  createOrder,
};
