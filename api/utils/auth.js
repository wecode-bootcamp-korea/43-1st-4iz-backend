const jwt = require("jsonwebtoken");

const { userDao } = require("../models");

const loginRequired = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    const error = new Error("NEED_ACCESS_TOKEN");
    error.statusCode = 401;

    return res.status(error.statusCode).json({ message: error.message });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    const result = await userDao.checkIfUserExistById(decoded.id);

    if (!result) {
      const error = new Error("NO_SUCH_USER");
      error.statusCode = 404;

      return res.status(error.statusCode).json({ message: error.message });
    }

    const user = await userDao.getUserById(decoded.id);

    req.user = user;

    next();
  } catch (err) {
    const error = new Error("JWT_ERROR");
    error.statusCode = 500;

    return res.status(error.statusCode).json({ message: error.message });
  }
};

module.exports = { loginRequired };
