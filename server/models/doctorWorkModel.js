const db = require("../config/db");

const getDoctorByUserId = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT
      d.id,
      d.user_id,
      d.clinic_id,
      d.first_name,
      d.last_name
    FROM doctors d
    WHERE d.user_id = ?
    `,
    [userId]
  );

  return rows[0];
};

const getDoctorPatients = async (doctorUserId) => {
  const doctor = await getDoctorByUserId(doctorUserId);
  if (!doctor) return null;

  const [rows] = await db.execute(
    `
    SELECT
      u.id AS patient_user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      MAX(a.appointment_date) AS last_appointment_date,
      COUNT(a.id) AS appointments_count
    FROM appointments a
    INNER JOIN users u ON u.id = a.patient_user_id
    WHERE a.doctor_id = ?
    GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone
    ORDER BY last_appointment_date DESC
    `,
    [doctor.id]
  );

  return {
    doctor,
    patients: rows,
  };
};

const getDoctorPatientDetails = async (doctorUserId, patientUserId) => {
  const doctor = await getDoctorByUserId(doctorUserId);
  if (!doctor) return null;

  const [patientRows] = await db.execute(
    `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      pp.date_of_birth,
      pp.gender,
      pp.blood_group,
      pp.emergency_contact_name,
      pp.emergency_contact_phone,
      pp.medical_notes
    FROM users u
    LEFT JOIN patient_profiles pp ON pp.user_id = u.id
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
    WHERE doctor_id = ? AND patient_user_id = ?
    `,
    [doctor.id, patientUserId]
  );

  if (!ownershipRows[0] || ownershipRows[0].total === 0) {
    return { forbidden: true };
  }

  const [allergyRows] = await db.execute(
    `
    SELECT id, allergy_name
    FROM patient_allergies
    WHERE user_id = ?
    ORDER BY allergy_name ASC
    `,
    [patientUserId]
  );

  const [appointmentRows] = await db.execute(
    `
    SELECT
      a.id,
      a.appointment_date,
      a.appointment_time,
      a.status,
      a.notes
    FROM appointments a
    WHERE a.doctor_id = ? AND a.patient_user_id = ?
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `,
    [doctor.id, patientUserId]
  );

  const [noteRows] = await db.execute(
    `
    SELECT
      dn.id,
      dn.note_text,
      dn.recommendation_text,
      dn.created_at,
      dn.appointment_id
    FROM doctor_notes dn
    WHERE dn.doctor_id = ? AND dn.patient_user_id = ?
    ORDER BY dn.created_at DESC
    `,
    [doctor.id, patientUserId]
  );

  return {
    doctor,
    patient,
    allergies: allergyRows,
    appointments: appointmentRows,
    notes: noteRows,
  };
};

const createDoctorNote = async ({
  doctorUserId,
  patientUserId,
  appointmentId,
  noteText,
  recommendationText,
}) => {
  const doctor = await getDoctorByUserId(doctorUserId);
  if (!doctor) return { doctorNotFound: true };

  const [ownershipRows] = await db.execute(
    `
    SELECT COUNT(*) AS total
    FROM appointments
    WHERE doctor_id = ? AND patient_user_id = ?
    `,
    [doctor.id, patientUserId]
  );

  if (!ownershipRows[0] || ownershipRows[0].total === 0) {
    return { forbidden: true };
  }

  const [result] = await db.execute(
    `
    INSERT INTO doctor_notes
    (doctor_id, patient_user_id, appointment_id, note_text, recommendation_text)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      doctor.id,
      patientUserId,
      appointmentId || null,
      noteText,
      recommendationText || null,
    ]
  );

  return { noteId: result.insertId };
};

module.exports = {
  getDoctorPatients,
  getDoctorPatientDetails,
  createDoctorNote,
};