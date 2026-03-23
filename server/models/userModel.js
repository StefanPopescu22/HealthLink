const db = require("../config/db");

const getExecutor = (connection) => connection || db;

const findUserByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await db.execute(
    `SELECT id, first_name, last_name, email, role, phone, profile_image, is_blocked, created_at
     FROM users
     WHERE id = ?`,
    [id]
  );
  return rows[0];
};

const createUser = async ({ firstName, lastName, email, passwordHash, role }, connection = null) => {
  const executor = getExecutor(connection);

  const [result] = await executor.execute(
    `INSERT INTO users (first_name, last_name, email, password_hash, role)
     VALUES (?, ?, ?, ?, ?)`,
    [firstName, lastName, email, passwordHash, role]
  );

  return result.insertId;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};