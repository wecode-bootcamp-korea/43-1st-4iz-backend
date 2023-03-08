const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { userDao } = require("../models");
const { validateEmail, validatePassword } = require("../utils/validation");

const signIn = async (email, password) => {
  await validateEmail(email);
  await validatePassword(password);

  const user = await userDao.getUserByEmail(email);

  if (!user) {
    const error = new Error("NO_SUCH_USER");
    error.statusCode = 400;

    throw error;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const error = new Error("WRONG_PASSWORD");
    error.statusCode = 401;

    throw error;
  }

  return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
};

module.exports = {
  signIn,
};
