const validateEmail = async (email) => {
  const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*/;

  if (!emailRegex.test(email)) {
    const error = new Error("INVALID_EMAIL");
    error.statusCode = 400;

    throw error;
  }
};

const validatePassword = async (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,15})/;

  if (!passwordRegex.test(password)) {
    const error = new Error("INVALID_PASSWORD");
    error.statusCode = 400;

    throw error;
  }
};

const validatePhoneNumber = async (phoneNumber) => {
  const phoneNumberRegex = /^([0-9]{3})[-]([0-9]{4})[-][0-9]{4}$/;

  if (!phoneNumberRegex.test(phoneNumber)) {
    const error = new Error("INVALID_PHONE_NUMBER");
    error.statusCode = 400;

    throw error;
  }
};

const validateZipcode = async (zipcode) => {
  const zipcodeRegex = /^[0-9]{5}/;

  if (!zipcodeRegex.test(zipcode)) {
    const error = new Error("INVALID_ZIPCODE");
    error.statusCode = 400;

    throw error;
  }
};

const validateNumber = async (number) => {
  const numberRegex = /^(|[1-9]\d*)$/;

  if (!numberRegex.test(number)) {
    const error = new Error("INVALID_NUMBER");
    error.statusCode = 4400;

    throw error;
  }
};

const validatePrice = async (price) => {
  if (price < 0) {
    const error = new Error("INVALID_PRICE");
    error.statusCode = 400;

    throw error;
  }
};

const validateGender = async (gender) => {
  if (gender !== "M" && gender !== "W" && gender !== "U") {
    const error = new Error("INVALID_GENDER");
    error.statusCode = 400;

    throw error;
  }
};

const validateIsNew = async (isNew) => {
  if (isNew !== 0 && isNew !== 1) {
    const error = new Error("INVALID_NEW");
    error.statusCode = 400;

    throw error;
  }
};

const validateDiscountRate = async (discountRate) => {
  if (discountRate < 0 || discountRate > 100) {
    const error = new Error("INVALID_DISCOUNT_RATE");
    error.statusCode = 400;

    throw error;
  }
};

const validateQuantity = async (quantity) => {
  if (quantity <= 0) {
    const error = new Error("INVALID_QUANTITY");
    error.statusCode = 400;

    throw error;
  }
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateZipcode,
  validateNumber,
  validatePrice,
  validateGender,
  validateIsNew,
  validateDiscountRate,
  validateQuantity,
};
