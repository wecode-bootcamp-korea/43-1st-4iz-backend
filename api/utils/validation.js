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
  const phoneNumberRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{4})[-.●]?([0-9]{4})$/;

  if (!phoneNumberRegex.test(phoneNumber)) {
    const error = new Error("INVALID_PHONE_NUMBER");
    error.statusCode = 400;

    throw error;
  }
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
};
