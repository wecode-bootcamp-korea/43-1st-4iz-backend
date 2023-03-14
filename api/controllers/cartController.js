const { cartService } = require("../services");
const { catchAsync } = require("../utils/error");

const createCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const productId = +req.params.productId;
  //const { color, size } = req.query;
  const { color, size, quantity = 1 } = req.body;

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

const updateCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const cartId = +req.params.cartId;
  const productId = +req.params.productId;
  const { quantity } = req.body;

  if (!cartId || !productId || !quantity) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;

    throw error;
  }

  const data = await cartService.updateCart(
    userId,
    cartId,
    productId,
    quantity
  );
  return res.status(201).json({ data });
});

module.exports = {
  createCart,
  updateCart,
};
