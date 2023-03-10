const express = require("express");

const { productController } = require("../controllers");

const router = express.Router();

router.post("/", productController.createProduct);
router.get("/search", productController.searchProduct);

module.exports = router;
