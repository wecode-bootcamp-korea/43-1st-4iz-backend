const express = require("express");

const { productController } = require("../controllers");

const router = express.Router();

router.post("/", productController.createProduct);

router.get("/sort", productController.sortProduct);

module.exports = router;
