const dataSource = require('./dataSource')

const createUser = async (name, email, password, phoneNumber, birthday) => {
    const result = await dataSource.query(`
    INSERT INTO users (
        name,
        email,
        password,
        phone_number,
        birthday
    ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?
    )
    `, [ name, email, password, phoneNumber, birthday ])

    return result.insertId
}

module.exports = {
    createUser
}