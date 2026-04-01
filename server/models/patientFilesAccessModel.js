const db = require("../config/db");

const getDoctorByUserId = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT id, user_id, clinic_id
    FROM doctors
    WHERE user_id = ?
    `,
    [userId]
  );

  return rows[0];
};

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

const doctorHasPatientRelation = async (doctorUserId, patientUserId) => {
  const doctor = await getDoctorByUserId(doctorUserId);
  if (!doctor) return { allowed: false };

  const [rows] = await db.execute(
    `
    SELECT COUNT(*) AS total
    FROM appointments
    WHERE doctor_id = ? AND patient_user_id = ?
    `,
    [doctor.id, patientUserId]
  );

  return {
    allowed: rows[0]?.total > 0,
    doctor,
  };
};

const clinicHasPatientRelation = async (clinicUserId, patientUserId) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return { allowed: false };

  const [rows] = await db.execute(
    `
    SELECT COUNT(*) AS total
    FROM appointments
    WHERE clinic_id = ? AND patient_user_id = ?
    `,
    [clinic.id, patientUserId]
  );

  return {
    allowed: rows[0]?.total > 0,
    clinic,
  };
};

const getPatientBasicInfo = async (patientUserId) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone
    FROM users
    WHERE id = ? AND role = 'patient'
    `,
    [patientUserId]
  );

  return rows[0];
};

module.exports = {
  getDoctorByUserId,
  getClinicByUserId,
  doctorHasPatientRelation,
  clinicHasPatientRelation,
  getPatientBasicInfo,
};