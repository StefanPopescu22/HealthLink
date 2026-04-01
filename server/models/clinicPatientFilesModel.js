const db = require("../config/db");
const { getDocumentsByPatient } = require("./documentModel");
const { getAnalysesByPatient } = require("./analysisModel");

const getClinicByUserId = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT id, user_id, name
    FROM clinics
    WHERE user_id = ?
    `,
    [userId]
  );

  return rows[0];
};

const getClinicPatientFiles = async (clinicUserId, patientUserId) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return null;

  const [patientRows] = await db.execute(
    `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone
    FROM users u
    WHERE u.id = ? AND u.role = 'patient'
    `,
    [patientUserId]
  );

  const patient = patientRows[0];
  if (!patient) return null;

  const [ownershipRows] = await db.execute(
    `
    SELECT COUNT(*) AS total
    FROM appointments
    WHERE clinic_id = ? AND patient_user_id = ?
    `,
    [clinic.id, patientUserId]
  );

  if (!ownershipRows[0] || ownershipRows[0].total === 0) {
    return { forbidden: true };
  }

  const documents = await getDocumentsByPatient(patientUserId);
  const analyses = await getAnalysesByPatient(patientUserId);

  return {
    clinic,
    patient,
    documents,
    analyses,
  };
};

module.exports = {
  getClinicPatientFiles,
};