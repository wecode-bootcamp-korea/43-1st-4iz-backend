const { cartService } = require("../services");
const { catchAsync } = require("../utils/error");

const DEFAULT_QUANTITY = 1;

const checkIfCartExistsByUserIdAndOptions = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const productId = +req.params.productId;
  const { options } = req.body;

  if (!productId || !options) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;

    throw error;
  }

  const result = await cartService.checkIfCartExistsByUserIdAndOptions(
    userId,
    productId,
    options
  );

  return res.status(200).json({ message: result });
});

const createCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const productId = +req.params.productId;
  const { options } = req.body;

  if (!productId || !options) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;

    throw error;
  }

  const insertId = await cartService.createCart(userId, productId, options);

  return res.status(201).json({
    insertId,
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

  if (!cartId || !productId) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;

    throw error;
  }

  await cartService.deleteCart(userId, cartId, productId);

  return res.status(204).send();
});

module.exports = {
  checkIfCartExistsByUserIdAndOptions,
  createCart,
  listCart,
  updateCart,
  deleteCart,
};
