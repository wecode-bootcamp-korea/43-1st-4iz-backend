const { cartService } = require("../services");
const { catchAsync } = require("../utils/error");

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
  deleteCart,
};
