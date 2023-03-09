const { productService } = require("../services");
const { catchAsync } = require("../utils/error");

const createProduct = catchAsync(async (req, res) => {
  const {
    name,
    price,
    gender,
    description,
    image,
    isNew,
    discountRate,
    releaseDate,
    color,
    size,
    quantity,
    category,
    subcategory,
  } = req.body;

  if (
    !name ||
    !price ||
    !gender ||
    !description ||
    !image ||
    !releaseDate ||
    !color ||
    !size ||
    !quantity ||
    !category ||
    !subcategory
  ) {
    const error = new Error("KEY_ERROR");
    error.status = 400;

    throw error;
  }

  // 숫자로 변환
  const priceInNum = +price;
  const isNewInNum = +isNew;
  const discountRateInNum = +discountRate;
  const quantityInNum = +quantity;

  await productService.createProduct(
    name,
    priceInNum,
    gender,
    description,
    image,
    isNewInNum,
    discountRateInNum,
    releaseDate,
    color,
    size,
    quantityInNum,
    category,
    subcategory
  );

  return res.status(201).json({ message: "successfully created" });
});

module.exports = {
  createProduct,
};
