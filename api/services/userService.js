const bcrypt = require('bcrypt')

const { emailValidationCheck, passwordValidationCheck, phoneNumberValidationCheck } = require('../utils/validation-check.js');

const { userDao } = require('../models')


const hashPassword = async (plaintextPassword) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    return bcrypt.hash(plaintextPassword, salt);
}

const signUp = async (name, email, password, phoneNumber, birthday) => {
    
    await emailValidationCheck(email);
    await passwordValidationCheck(password);
    await phoneNumberValidationCheck(phoneNumber);

    const hashedPassword = await hashPassword(password)

    return userDao.createUser(name, email, hashedPassword, phoneNumber, birthday)
}

module.exports = {
    signUp
}