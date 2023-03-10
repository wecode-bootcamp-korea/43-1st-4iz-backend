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

const searchProduct = catchAsync(async (req, res) => {
  let {
    limit = 10,
    offset = 0,
    searchMethod,
    sortMethod = "price",
    ...filterOptions
  } = req.query;

  console.log(limit);
  console.log(offset);
  console.log(searchMethod);
  console.log(sortMethod);
  console.log(filterOptions);

  searchMethod = searchMethod.replaceAll('"', "");
  sortMethod = sortMethod.replaceAll('"', "");

  const result = await productService.searchProduct(
    limit,
    offset,
    searchMethod,
    sortMethod,
    filterOptions
  );

  res.status(200).json(result);
});

module.exports = {
  createProduct,
  searchProduct,
};
