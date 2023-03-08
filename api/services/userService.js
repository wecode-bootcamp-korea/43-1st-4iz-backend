const bcrypt = require('bcrypt')

const { userDao } = require('../models')

const hashPassword = async (plaintextPassword) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    return bcrypt.hash(plaintextPassword, salt);
}

const signUp = async (name, email, password, phoneNumber, birthday) => {
    const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*/
    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,15})/
    const phoneNumberRegex =/^\(?([0-9]{3})\)?[-.●]?([0-9]{4})[-.●]?([0-9]{4})$/

    if (!emailRegex.test(email)) {
        const error = new Error('INVALID_EMAIL')
        error.statusCode = 400

        throw error
    }

    if (!passwordRegex.test(password)) {
        const error = new Error('INVALID_PASSWORD')
        error.statusCode = 400

        throw error
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
        const error = new Error('INVALID_PHONE_NUMBER')
        error.statusCode = 400

        throw error
    }

    const hashedPassword = await hashPassword(password)

    return userDao.createUser(name, email, hashedPassword, phoneNumber, birthday)
}

module.exports = {
    signUp
}