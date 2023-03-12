const dataSource = require("./dataSource");

const createUser = async (name, email, password, phoneNumber, birthday) => {
  const result = await dataSource.query(
    `
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
  `,
    [name, email, password, phoneNumber, birthday]
  );

  return result.insertId;
};

const getUserByEmail = async (email) => {
  const [user] = await dataSource.query(
    `
    SELECT
      name,
      email,
      password,
      phone_number,
      birthday
    FROM users
    WHERE email = ?
  `,
    [email]
  );

  return user;
};

const checkIfUserExistsByEmail = async (email) => {
  const [result] = await dataSource.query(
    `
    SELECT EXISTS(
      SELECT id 
      FROM users 
      WHERE email = ?
    ) AS value
  `,
    [email]
  );

  return !!parseInt(result.value);
};

module.exports = {
  createUser,
  getUserByEmail,
  checkIfUserExistsByEmail,
};
