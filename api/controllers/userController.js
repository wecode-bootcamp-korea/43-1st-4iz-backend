const { userService } = require("../services/");
const { catchAsync } = require("../utils/error");

const signIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("KEY_ERROR");
    error.status = 400;

    throw error;
  }

  const accessToken = await userService.signIn(email, password);

  return res.status(200).json({ accessToken: accessToken });
});

module.exports = {
  signIn,
};
