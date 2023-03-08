const dataSource = require("./dataSource");

const getUserByEmail = async (email) => {
  const [user] = await dataSource.query(
    `
    SELECT
      id,
      password
    FROM users
    WHERE email=?
  `,
    [email]
  );

  return user;
};

module.exports = {
  getUserByEmail,
};
