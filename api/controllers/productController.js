const { productService } = require("../services");
const { catchAsync } = require("../utils/error");

const createProduct = catchAsync(async (req, res) => {
  const {
    name,
    price,
    gender,
    description,
    image,
    is_new,
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
    !release_date ||
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

  // Convert into number
  const priceInNum = +price;
  const discountRateInNum = +discountRate;

  const insertId = await productService.createProduct(
    name,
    priceInNum,
    gender,
    description,
    image,
    is_new,
    discountRateInNum,
    releaseDate,
    color,
    size,
    quantity,
    category,
    subcategory
  );

  return res.status(201).json({ data: insertId });
});

module.exports = {
  createProduct,
};
