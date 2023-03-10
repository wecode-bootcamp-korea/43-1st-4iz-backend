const { productService } = require("../services");
const { catchAsync } = require("../utils/error");
const { parseQuotes } = require("../utils/parser");

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
  } = req.body;

  if (
    !name ||
    !price ||
    !gender ||
    !description ||
    !image ||
    !isNew ||
    !discountRate ||
    !releaseDate ||
    !color ||
    !size ||
    !quantity ||
    !category
  ) {
    const error = new Error("KEY_ERROR");
    error.status = 400;

    throw error;
  }

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
    category
  );

  return res.status(201).json({ message: "successfully created" });
});

const sortProduct = catchAsync(async (req, res) => {
  const { order } = req.query;

  if (!order) {
    const error = new Error("KEY_ERROR");
    error.status = 400;

    throw error;
  }

  const result = await productService.sortProduct(parseQuotes(order)[0]);

  return res.status(200).json({ data: result });
});

module.exports = {
  createProduct,
  sortProduct,
};
