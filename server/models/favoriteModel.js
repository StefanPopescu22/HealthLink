const db = require("../config/db");

const getFavoriteByUserAndClinic = async (userId, clinicId) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM favorites
    WHERE user_id = ? AND clinic_id = ?
    `,
    [userId, clinicId]
  );

  return rows[0];
};

const addFavorite = async (userId, clinicId) => {
  const [result] = await db.execute(
    `
    INSERT INTO favorites (user_id, clinic_id)
    VALUES (?, ?)
    `,
    [userId, clinicId]
  );

  return result.insertId;
};

const removeFavorite = async (userId, clinicId) => {
  await db.execute(
    `
    DELETE FROM favorites
    WHERE user_id = ? AND clinic_id = ?
    `,
    [userId, clinicId]
  );
};

const getFavoriteClinicsByUser = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT
      f.id AS favorite_id,
      f.created_at AS favorited_at,
      c.id AS id,
      c.name,
      c.clinic_type,
      c.city,
      c.address,
      c.phone,
      c.email,
      c.description,
      COALESCE(rv.rating, 0) AS rating
    FROM favorites f
    INNER JOIN clinics c ON c.id = f.clinic_id
    LEFT JOIN (
      SELECT
        clinic_id,
        ROUND(AVG(rating), 1) AS rating
      FROM reviews
      GROUP BY clinic_id
    ) rv ON rv.clinic_id = c.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
    `,
    [userId]
  );

  return rows;
};

module.exports = {
  getFavoriteByUserAndClinic,
  addFavorite,
  removeFavorite,
  getFavoriteClinicsByUser,
};