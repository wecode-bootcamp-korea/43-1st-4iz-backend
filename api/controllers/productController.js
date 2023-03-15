const { productService } = require("../services");
const { catchAsync } = require("../utils/error");

const LIMIT_DEFAULT = 10;
const OFFSET_DEFAULT = 0;

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

const listProduct = catchAsync(async (req, res) => {
  const {
    limit = LIMIT_DEFAULT,
    offset = OFFSET_DEFAULT,
    search = "",
    sort = "date",
    ...filters
  } = req.query;

  const result = await productService.listProduct(
    limit,
    offset,
    search,
    sort,
    filters
  );

  return res.status(200).json({ data: result });
});

const getProductDetailById = catchAsync(async (req, res) => {
  const productId = +req.params.productId;

  if (!productId) {
    const error = new Error("KEY_ERROR");
    error.status = 400;

    throw error;
  }

  const result = await productService.getProductDetailById(productId);

  return res.status(200).json({ data: result });
});

module.exports = {
  createProduct,
  getProductDetailById,
  listProduct,
};
