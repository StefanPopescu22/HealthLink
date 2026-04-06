const db = require("../config/db");

const createMedicalDocument = async ({
  patientUserId,
  clinicId,
  doctorId,
  appointmentId,
  title,
  category,
  fileName,
  filePath,
  createdByUserId,
}) => {
  const [result] = await db.execute(
    `
    INSERT INTO medical_documents
    (user_id, clinic_id, doctor_id, appointment_id, title, category, file_name, file_path, created_by_user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      patientUserId,
      clinicId || null,
      doctorId || null,
      appointmentId || null,
      title,
      category || null,
      fileName,
      filePath,
      createdByUserId || null,
    ]
  );

  return result.insertId;
};

const getDocumentsByPatient = async (patientUserId) => {
  const [rows] = await db.execute(
    `
    SELECT
      md.id,
      md.title,
      md.category,
      md.file_name,
      md.file_path,
      md.uploaded_at,
      md.updated_at,
      c.name AS clinic_name,
      d.first_name AS doctor_first_name,
      d.last_name AS doctor_last_name,
      cu.first_name AS created_by_first_name,
      cu.last_name AS created_by_last_name,
      cu.role AS created_by_role
    FROM medical_documents md
    LEFT JOIN clinics c ON c.id = md.clinic_id
    LEFT JOIN doctors d ON d.id = md.doctor_id
    LEFT JOIN users cu ON cu.id = md.created_by_user_id
    WHERE md.user_id = ?
    ORDER BY md.uploaded_at DESC
    `,
    [patientUserId]
  );

  return rows;
};

const getDoctorDocumentsByPatient = async (patientUserId) => {
  return await getDocumentsByPatient(patientUserId);
};

const getDocumentById = async (documentId) => {
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

const updateMedicalDocument = async ({
  documentId,
  title,
  category,
  fileName,
  filePath,
  clinicId,
  doctorId,
  appointmentId,
}) => {
  await db.execute(
    `
    UPDATE medical_documents
    SET
      title = ?,
      category = ?,
      file_name = COALESCE(?, file_name),
      file_path = COALESCE(?, file_path),
      clinic_id = ?,
      doctor_id = ?,
      appointment_id = ?
    WHERE id = ?
    `,
    [
      title,
      category || null,
      fileName || null,
      filePath || null,
      clinicId || null,
      doctorId || null,
      appointmentId || null,
      documentId,
    ]
  );
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
  getDocumentsByPatient,
  getDoctorDocumentsByPatient,
  getDocumentById,
  updateMedicalDocument,
  deleteMedicalDocument,
};