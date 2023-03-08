const dataSource = require("./dataSource");

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

const doesUserExistByEmail = async (email) => {
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
  getUserByEmail,
  doesUserExistByEmail,
};
