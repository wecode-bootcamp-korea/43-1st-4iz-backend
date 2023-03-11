const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { userDao } = require("../models");
const {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} = require("../utils/validation");

const hashPassword = async (plaintextPassword) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  return bcrypt.hash(plaintextPassword, salt);
};

const signUp = async (name, email, password, phoneNumber, birthday) => {
  await validateEmail(email);
  await validatePassword(password);
  await validatePhoneNumber(phoneNumber);

  const hashedPassword = await hashPassword(password);

  return userDao.createUser(name, email, hashedPassword, phoneNumber, birthday);
};

const signIn = async (email, password) => {
  await validateEmail(email);
  await validatePassword(password);

  const result = await userDao.doesUserExistByEmail(email);

  if (!result) {
    const error = new Error("NO_SUCH_USER");
    error.statusCode = 404;

    throw error;
  }

  const user = await userDao.getUserByEmail(email);

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const error = new Error("WRONG_PASSWORD");
    error.statusCode = 401;

    throw error;
  }

  return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
};

module.exports = {
  signUp,
  signIn,
};
