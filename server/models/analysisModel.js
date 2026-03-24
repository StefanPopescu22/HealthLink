const db = require("../config/db");

const createMedicalAnalysis = async ({
  userId,
  title,
  analysisType,
  labName,
  resultStatus,
  fileName,
  filePath,
}) => {
  const [result] = await db.execute(
    `
    INSERT INTO medical_analyses
    (user_id, title, analysis_type, lab_name, result_status, file_name, file_path)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [userId, title, analysisType, labName || null, resultStatus || "available", fileName, filePath]
  );

  return result.insertId;
};

const getMedicalAnalysesByUser = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      title,
      analysis_type,
      lab_name,
      result_status,
      file_name,
      file_path,
      uploaded_at
    FROM medical_analyses
    WHERE user_id = ?
    ORDER BY uploaded_at DESC
    `,
    [userId]
  );

  return rows;
};

const getMedicalAnalysisById = async (analysisId) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM medical_analyses
    WHERE id = ?
    `,
    [analysisId]
  );

  return rows[0];
};

const deleteMedicalAnalysis = async (analysisId) => {
  await db.execute(
    `
    DELETE FROM medical_analyses
    WHERE id = ?
    `,
    [analysisId]
  );
};

module.exports = {
  createMedicalAnalysis,
  getMedicalAnalysesByUser,
  getMedicalAnalysisById,
  deleteMedicalAnalysis,
};