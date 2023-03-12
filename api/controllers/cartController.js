const { cartService } = require("../services");
const { catchAsync } = require("../utils/error");

const listCart = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const data = await cartService.listCart(userId);

  return res.status(201).json({ data });
});

module.exports = {
  listCart,
};
