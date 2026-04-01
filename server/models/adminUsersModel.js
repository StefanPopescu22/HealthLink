const db = require("../config/db");

const getAllUsersForAdmin = async () => {
  const [rows] = await db.execute(
    `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.role,
      u.phone,
      u.is_blocked,
      u.created_at
    FROM users u
    ORDER BY u.created_at DESC
    `
  );

  return rows;
};

const setUserBlockedState = async (userId, blocked) => {
  await db.execute(
    `
    UPDATE users
    SET is_blocked = ?
    WHERE id = ?
    `,
    [blocked ? 1 : 0, userId]
  );
};

const getUserById = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT id, first_name, last_name, email, role, is_blocked
    FROM users
    WHERE id = ?
    `,
    [userId]
  );

  return rows[0];
};

const deleteUserById = async (userId) => {
  await db.execute(
    `
    DELETE FROM users
    WHERE id = ?
    `,
    [userId]
  );
};

module.exports = {
  getAllUsersForAdmin,
  setUserBlockedState,
  getUserById,
  deleteUserById, 
};