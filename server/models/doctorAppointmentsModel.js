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

const getDoctorAppointments = async (doctorUserId) => {
  const doctor = await getDoctorByUserId(doctorUserId);
  if (!doctor) return null;

  const [rows] = await db.execute(
    `
    SELECT
      a.id,
      a.patient_user_id,
      a.appointment_date,
      a.appointment_time,
      a.status,
      a.notes,
      u.first_name AS patient_first_name,
      u.last_name AS patient_last_name,
      u.phone AS patient_phone,
      c.name AS clinic_name
    FROM appointments a
    INNER JOIN users u ON u.id = a.patient_user_id
    INNER JOIN clinics c ON c.id = a.clinic_id
    WHERE a.doctor_id = ?
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `,
    [doctor.id]
  );

  return {
    doctor,
    appointments: rows,
  };
};

const getDoctorAppointmentById = async (doctorUserId, appointmentId) => {
  const doctor = await getDoctorByUserId(doctorUserId);
  if (!doctor) return null;

  const [rows] = await db.execute(
    `
    SELECT *
    FROM appointments
    WHERE id = ? AND doctor_id = ?
    `,
    [appointmentId, doctor.id]
  );

  return rows[0];
};

const updateDoctorAppointmentStatus = async (doctorUserId, appointmentId, status) => {
  const appointment = await getDoctorAppointmentById(doctorUserId, appointmentId);
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
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
};