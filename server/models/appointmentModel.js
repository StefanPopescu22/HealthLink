const db = require("../config/db");

const createAppointment = async ({
  patientUserId,
  clinicId,
  doctorId,
  serviceId,
  appointmentDate,
  appointmentTime,
  notes,
}) => {
  const [result] = await db.execute(
    `
    INSERT INTO appointments
    (patient_user_id, clinic_id, doctor_id, service_id, appointment_date, appointment_time, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      patientUserId,
      clinicId,
      doctorId,
      serviceId,
      appointmentDate,
      appointmentTime,
      notes || null,
    ]
  );

  return result.insertId;
};

const getAppointmentsByPatient = async (patientUserId) => {
  const [rows] = await db.execute(
    `
    SELECT
      a.id,
      a.appointment_date,
      a.appointment_time,
      a.status,
      a.notes,
      a.created_at,
      c.id AS clinic_id,
      c.name AS clinic_name,
      d.id AS doctor_id,
      d.first_name AS doctor_first_name,
      d.last_name AS doctor_last_name,
      s.id AS service_id,
      s.name AS service_name,
      s.duration_minutes
    FROM appointments a
    INNER JOIN clinics c ON c.id = a.clinic_id
    INNER JOIN doctors d ON d.id = a.doctor_id
    LEFT JOIN services s ON s.id = a.service_id
    WHERE a.patient_user_id = ?
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `,
    [patientUserId]
  );

  return rows;
};

const getAppointmentById = async (appointmentId) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM appointments
    WHERE id = ?
    `,
    [appointmentId]
  );

  return rows[0];
};

const cancelAppointment = async (appointmentId) => {
  await db.execute(
    `
    UPDATE appointments
    SET status = 'cancelled'
    WHERE id = ?
    `,
    [appointmentId]
  );
};

const getClinicForAppointment = async (clinicId) => {
  const [rows] = await db.execute(
    `
    SELECT id, name, approved
    FROM clinics
    WHERE id = ?
    `,
    [clinicId]
  );

  return rows[0];
};

const getDoctorForAppointment = async (doctorId) => {
  const [rows] = await db.execute(
    `
    SELECT id, clinic_id, first_name, last_name
    FROM doctors
    WHERE id = ?
    `,
    [doctorId]
  );

  return rows[0];
};

const getClinicServiceForAppointment = async (clinicId, serviceId) => {
  const [rows] = await db.execute(
    `
    SELECT
      cs.id,
      cs.clinic_id,
      cs.service_id,
      cs.price,
      s.name,
      s.duration_minutes
    FROM clinic_services cs
    INNER JOIN services s ON s.id = cs.service_id
    WHERE cs.clinic_id = ? AND cs.service_id = ?
    `,
    [clinicId, serviceId]
  );

  return rows[0];
};

const getDoctorWorkingHoursForDate = async (doctorId, appointmentDate) => {
  const date = new Date(`${appointmentDate}T00:00:00`);
  const weekday = date.getDay();

  const [rows] = await db.execute(
    `
    SELECT
      id,
      doctor_id,
      weekday,
      start_time,
      end_time
    FROM doctor_working_hours
    WHERE doctor_id = ? AND weekday = ?
    ORDER BY start_time ASC
    `,
    [doctorId, weekday]
  );

  return rows;
};

const getDoctorAppointmentsForDate = async (doctorId, appointmentDate) => {
  const [rows] = await db.execute(
    `
    SELECT
      a.id,
      a.appointment_time,
      a.status,
      COALESCE(s.duration_minutes, 30) AS duration_minutes
    FROM appointments a
    LEFT JOIN services s ON s.id = a.service_id
    WHERE a.doctor_id = ?
      AND a.appointment_date = ?
      AND a.status IN ('pending', 'confirmed')
    ORDER BY a.appointment_time ASC
    `,
    [doctorId, appointmentDate]
  );

  return rows;
};

const hasPatientDuplicateAppointment = async ({
  patientUserId,
  doctorId,
  appointmentDate,
  appointmentTime,
}) => {
  const [rows] = await db.execute(
    `
    SELECT COUNT(*) AS total
    FROM appointments
    WHERE patient_user_id = ?
      AND doctor_id = ?
      AND appointment_date = ?
      AND appointment_time = ?
      AND status IN ('pending', 'confirmed')
    `,
    [patientUserId, doctorId, appointmentDate, appointmentTime]
  );

  return rows[0]?.total > 0;
};

module.exports = {
  createAppointment,
  getAppointmentsByPatient,
  getAppointmentById,
  cancelAppointment,
  getClinicForAppointment,
  getDoctorForAppointment,
  getClinicServiceForAppointment,
  getDoctorWorkingHoursForDate,
  getDoctorAppointmentsForDate,
  hasPatientDuplicateAppointment,
};