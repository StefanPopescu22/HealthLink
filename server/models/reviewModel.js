const db = require("../config/db");

const getReviewByUserAndClinic = async (userId, clinicId) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM reviews
    WHERE user_id = ? AND clinic_id = ?
    `,
    [userId, clinicId]
  );

  return rows[0];
};

const getReviewById = async (reviewId) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM reviews
    WHERE id = ?
    `,
    [reviewId]
  );

  return rows[0];
};

const createReview = async ({ userId, clinicId, rating, comment }) => {
  const [result] = await db.execute(
    `
    INSERT INTO reviews (user_id, clinic_id, rating, comment)
    VALUES (?, ?, ?, ?)
    `,
    [userId, clinicId, rating, comment || null]
  );

  return result.insertId;
};

const updateReview = async ({ reviewId, rating, comment }) => {
  await db.execute(
    `
    UPDATE reviews
    SET rating = ?, comment = ?
    WHERE id = ?
    `,
    [rating, comment || null, reviewId]
  );
};

const deleteReview = async (reviewId) => {
  await db.execute(
    `
    DELETE FROM reviews
    WHERE id = ?
    `,
    [reviewId]
  );
};

module.exports = {
  getReviewByUserAndClinic,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};