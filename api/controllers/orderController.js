const { orderService } = require("../services/");
const { catchAsync } = require("../utils/error");

const createOrder = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { name, street, address, zipcode, phoneNumber, email } = req.body;

  if (!name || !street || !address || !zipcode || !phoneNumber || !email) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;

    throw error;
  }

  const insertId = await orderService.createOrder(
    userId,
    name,
    street,
    address,
    zipcode,
    phoneNumber,
    email
  );

  return res.status(201).json({ insertId });
});

module.exports = {
  createOrder,
};
