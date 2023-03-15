const express = require("express");

const { productController } = require("../controllers");

const router = express.Router();

router.get('/:productId', productController.productInfo);
router.post("", productController.createProduct);
router.get("/list", productController.listProduct);
router.get("/:productId", productController.getProductDetailById);
router.get("/:productId/recommendation", productController.getRecommendation);

module.exports = router;