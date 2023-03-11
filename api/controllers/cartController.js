const { cartService } = require("../services");
const { catchAsync } = require("../utils/error");

const getCarts = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const data = await cartService.getCarts(userId);

  return res.status(201).json({ data });
});

module.exports = {
  getCarts,
};
