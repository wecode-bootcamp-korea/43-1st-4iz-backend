const express = require("express");

const { cartController } = require("../controllers");
const { loginRequired } = require("../utils/auth");

const router = express.Router();

router.delete(
  "/:cartId/products/:productId",
  loginRequired,
  cartController.deleteCart
);

module.exports = router;
