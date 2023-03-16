const { cartService } = require("../services");
const { catchAsync } = require("../utils/error");

const QUANTITY_DEFAULT = 1;

const createCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const productId = +req.params.productId;
  const { options } = req.body;

  if (!productId || !options) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;

    throw error;
  }
  const insertNum = await cartService.createCart(userId, productId, options);

  return res.status(201).json({
    message: `Products successfully inserted into your cart!`,
  });
});

const listCart = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const data = await cartService.listCart(userId);

  return res.status(200).json({ data });
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

const deleteCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const cartId = +req.params.cartId;
  const productId = +req.params.productId;

  if (!productId || !cartId) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;

    throw error;
  }

  await cartService.deleteCart(userId, cartId, productId);

  return res.status(204).send();
});

module.exports = {
  createCart,
  listCart,
  updateCart,
  deleteCart,
};
