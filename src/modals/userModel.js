const db = require("../services/databaseService").dbClient;

const createUser = async (userData) => {
  const { username, email, passwordHash } = userData;
  const query =
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *";
  const values = [username, email, passwordHash];
  const result = await db.query(query, values);
  return result.rows[0];
};

const findUserById = async (userId) => {
  const query = "SELECT * FROM users WHERE user_id = $1";
  const values = [userId];
  const result = await db.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  const result = await db.query(query, values);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
};
