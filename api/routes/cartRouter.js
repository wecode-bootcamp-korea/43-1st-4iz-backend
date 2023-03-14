const express = require("express");

const { cartController } = require("../controllers");
const { loginRequired } = require("../utils/auth");

const router = express.Router();

router.post("/:productId", loginRequired, cartController.createCart);
router.get("/", loginRequired, cartController.listCart);
router.patch(
  "/:cartId/products/:productId",
  loginRequired,
  cartController.updateCart
);
router.delete(
  "/:cartId/products/:productId",
  loginRequired,
  cartController.deleteCart
);

module.exports = router;
