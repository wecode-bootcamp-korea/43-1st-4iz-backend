const { cartService } = require("../services");
const { catchAsync } = require("../utils/error");

const createCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const productId = +req.params.productId;
  const { color, size } = req.query;
  const { quantity = 1 } = req.body;

  if (!productId || !color || !size) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;

    throw error;
  }

  const insertId = await cartService.createCart(
    userId,
    productId,
    color,
    size,
    quantity
  );

  return res.status(201).json({ insertId });
});

module.exports = {
  createCart,
};
