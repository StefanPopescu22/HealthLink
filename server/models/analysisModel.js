const db = require("../config/db");

const createMedicalAnalysis = async ({
  patientUserId,
  clinicId,
  doctorId,
  appointmentId,
  title,
  analysisType,
  labName,
  resultStatus,
  fileName,
  filePath,
  createdByUserId,
}) => {
  const [result] = await db.execute(
    `
    INSERT INTO medical_analyses
    (user_id, clinic_id, doctor_id, appointment_id, title, analysis_type, lab_name, result_status, file_name, file_path, created_by_user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      patientUserId,
      clinicId || null,
      doctorId || null,
      appointmentId || null,
      title,
      analysisType || null,
      labName || null,
      resultStatus || null,
      fileName,
      filePath,
      createdByUserId || null,
    ]
  );

  return result.insertId;
};

const getAnalysesByPatient = async (patientUserId) => {
  const [rows] = await db.execute(
    `
    SELECT
      ma.id,
      ma.title,
      ma.analysis_type,
      ma.lab_name,
      ma.result_status,
      ma.file_name,
      ma.file_path,
      ma.uploaded_at,
      ma.updated_at,
      c.name AS clinic_name,
      d.first_name AS doctor_first_name,
      d.last_name AS doctor_last_name,
      cu.first_name AS created_by_first_name,
      cu.last_name AS created_by_last_name,
      cu.role AS created_by_role
    FROM medical_analyses ma
    LEFT JOIN clinics c ON c.id = ma.clinic_id
    LEFT JOIN doctors d ON d.id = ma.doctor_id
    LEFT JOIN users cu ON cu.id = ma.created_by_user_id
    WHERE ma.user_id = ?
    ORDER BY ma.uploaded_at DESC
    `,
    [patientUserId]
  );

  return rows;
};

const getDoctorAnalysesByPatient = async (patientUserId) => {
  return await getAnalysesByPatient(patientUserId);
};

const getAnalysisById = async (analysisId) => {
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

const updateMedicalAnalysis = async ({
  analysisId,
  title,
  analysisType,
  labName,
  resultStatus,
  fileName,
  filePath,
  clinicId,
  doctorId,
  appointmentId,
}) => {
  await db.execute(
    `
    UPDATE medical_analyses
    SET
      title = ?,
      analysis_type = ?,
      lab_name = ?,
      result_status = ?,
      file_name = COALESCE(?, file_name),
      file_path = COALESCE(?, file_path),
      clinic_id = ?,
      doctor_id = ?,
      appointment_id = ?
    WHERE id = ?
    `,
    [
      title,
      analysisType || null,
      labName || null,
      resultStatus || null,
      fileName || null,
      filePath || null,
      clinicId || null,
      doctorId || null,
      appointmentId || null,
      analysisId,
    ]
  );
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
  getAnalysesByPatient,
  getDoctorAnalysesByPatient, 
  getAnalysisById,
  updateMedicalAnalysis,
  deleteMedicalAnalysis,
};