const db = require("../config/db");

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

const getClinicAppointments = async (clinicUserId) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return null;

  const [rows] = await db.execute(
    `
    SELECT
      a.id,
      a.patient_user_id,
      a.doctor_id,
      a.appointment_date,
      a.appointment_time,
      a.status,
      a.notes,
      u.first_name AS patient_first_name,
      u.last_name AS patient_last_name,
      d.first_name AS doctor_first_name,
      d.last_name AS doctor_last_name
    FROM appointments a
    INNER JOIN users u ON u.id = a.patient_user_id
    INNER JOIN doctors d ON d.id = a.doctor_id
    WHERE a.clinic_id = ?
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `,
    [clinic.id]
  );

  return {
    clinic,
    appointments: rows,
  };
};

const getClinicAppointmentById = async (clinicUserId, appointmentId) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return null;

  const [rows] = await db.execute(
    `
    SELECT *
    FROM appointments
    WHERE id = ? AND clinic_id = ?
    `,
    [appointmentId, clinic.id]
  );

  return rows[0];
};

const updateClinicAppointmentStatus = async (clinicUserId, appointmentId, status) => {
  const appointment = await getClinicAppointmentById(clinicUserId, appointmentId);
  if (!appointment) return { notFound: true };

  await db.execute(
    `
    UPDATE appointments
    SET status = ?
    WHERE id = ?
    `,
    [status, appointmentId]
  );

  return { success: true };
};

module.exports = {
  getClinicAppointments,
  updateClinicAppointmentStatus,
};