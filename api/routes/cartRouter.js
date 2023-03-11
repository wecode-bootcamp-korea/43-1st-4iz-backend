const express = require("express");

const { cartController } = require("../controllers");
const { loginRequired } = require("../utils/auth");

const router = express.Router();

router.get("/", loginRequired, cartController.getCarts);

module.exports = router;
