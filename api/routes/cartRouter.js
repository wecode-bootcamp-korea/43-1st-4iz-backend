const express = require("express");

const { cartController } = require("../controllers");
const { loginRequired } = require("../utils/auth");

const router = express.Router();

router.post("/:productId", loginRequired, cartController.createCart);
router.delete(
  "/:cartId/products/:productId",
  loginRequired,
  cartController.deleteCart
);

module.exports = router;
