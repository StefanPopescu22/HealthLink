const db = require("../config/db");

const getExecutor = (connection) => connection || db;

const createClinicProfile = async (
  {
    userId,
    clinicName,
    clinicType,
    city,
    address,
    phone,
    email,
    description,
    approved = true,
  },
  connection = null
) => {
  const executor = getExecutor(connection);

  const [result] = await executor.execute(
    `INSERT INTO clinics (user_id, name, clinic_type, city, address, phone, email, description, approved)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, clinicName, clinicType, city, address, phone, email, description, approved]
  );

  return result.insertId;
};

const findClinicByUserId = async (userId) => {
  const [rows] = await db.execute(
    `SELECT id, user_id, name, clinic_type, city, address, phone, email, description, approved
     FROM clinics
     WHERE user_id = ?`,
    [userId]
  );

  return rows[0];
};

const clinicExists = async (clinicId) => {
  const [rows] = await db.execute("SELECT id, name FROM clinics WHERE id = ?", [clinicId]);
  return rows[0];
};

const listClinicOptions = async () => {
  const [rows] = await db.execute(
    `SELECT id, name, city
     FROM clinics
     ORDER BY name ASC`
  );
  return rows;
};

module.exports = {
  createClinicProfile,
  findClinicByUserId,
  clinicExists,
  listClinicOptions,
};