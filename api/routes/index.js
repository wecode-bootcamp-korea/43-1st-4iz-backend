const express = require("express");

const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const cartRouter = require("./cartRouter");
const orderRouter = require("./orderRouter");

const router = express.Router();

router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/carts", cartRouter);
router.use("/orders", orderRouter);

module.exports = router;
