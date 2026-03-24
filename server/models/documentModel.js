const db = require("../config/db");

const createMedicalDocument = async ({
  userId,
  title,
  category,
  fileName,
  filePath,
}) => {
  const [result] = await db.execute(
    `
    INSERT INTO medical_documents
    (user_id, title, category, file_name, file_path)
    VALUES (?, ?, ?, ?, ?)
    `,
    [userId, title, category, fileName, filePath]
  );

  return result.insertId;
};

const getMedicalDocumentsByUser = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      title,
      category,
      file_name,
      file_path,
      uploaded_at
    FROM medical_documents
    WHERE user_id = ?
    ORDER BY uploaded_at DESC
    `,
    [userId]
  );

  return rows;
};

const getMedicalDocumentById = async (documentId) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM medical_documents
    WHERE id = ?
    `,
    [documentId]
  );

  return rows[0];
};

const deleteMedicalDocument = async (documentId) => {
  await db.execute(
    `
    DELETE FROM medical_documents
    WHERE id = ?
    `,
    [documentId]
  );
};

module.exports = {
  createMedicalDocument,
  getMedicalDocumentsByUser,
  getMedicalDocumentById,
  deleteMedicalDocument,
};