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

const getDoctorById = async (doctorId) => {
  const [rows] = await db.execute(
    `
    SELECT
      d.id,
      d.user_id,
      d.clinic_id,
      d.first_name,
      d.last_name,
      c.name AS clinic_name
    FROM doctors d
    LEFT JOIN clinics c ON c.id = d.clinic_id
    WHERE d.id = ?
    `,
    [doctorId]
  );

  return rows[0];
};

const getClinicDoctorsOptions = async (clinicUserId) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return null;

  const [rows] = await db.execute(
    `
    SELECT
      d.id,
      d.first_name,
      d.last_name
    FROM doctors d
    WHERE d.clinic_id = ?
    ORDER BY d.first_name, d.last_name
    `,
    [clinic.id]
  );

  return {
    clinic,
    doctors: rows,
  };
};

const getAdminDoctorsOptions = async () => {
  const [rows] = await db.execute(
    `
    SELECT
      d.id,
      d.first_name,
      d.last_name,
      c.name AS clinic_name
    FROM doctors d
    LEFT JOIN clinics c ON c.id = d.clinic_id
    ORDER BY d.first_name, d.last_name
    `
  );

  return rows;
};

const getDoctorWorkingHours = async (doctorId) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      doctor_id,
      weekday,
      start_time,
      end_time
    FROM doctor_working_hours
    WHERE doctor_id = ?
    ORDER BY weekday ASC, start_time ASC
    `,
    [doctorId]
  );

  return rows;
};

const clinicCanManageDoctor = async (clinicUserId, doctorId) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return false;

  const doctor = await getDoctorById(doctorId);
  if (!doctor) return false;

  return Number(doctor.clinic_id) === Number(clinic.id);
};

const getWorkingHourById = async (scheduleId) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM doctor_working_hours
    WHERE id = ?
    `,
    [scheduleId]
  );

  return rows[0];
};

const hasScheduleOverlap = async ({
  doctorId,
  weekday,
  startTime,
  endTime,
  excludeScheduleId = null,
}) => {
  let sql = `
    SELECT COUNT(*) AS total
    FROM doctor_working_hours
    WHERE doctor_id = ?
      AND weekday = ?
      AND (? < end_time AND ? > start_time)
  `;

  const params = [doctorId, weekday, startTime, endTime];

  if (excludeScheduleId) {
    sql += ` AND id <> ? `;
    params.push(excludeScheduleId);
  }

  const [rows] = await db.execute(sql, params);
  return rows[0]?.total > 0;
};

const createWorkingHour = async ({ doctorId, weekday, startTime, endTime }) => {
  const [result] = await db.execute(
    `
    INSERT INTO doctor_working_hours
    (doctor_id, weekday, start_time, end_time)
    VALUES (?, ?, ?, ?)
    `,
    [doctorId, weekday, startTime, endTime]
  );

  return result.insertId;
};

const updateWorkingHour = async ({ scheduleId, weekday, startTime, endTime }) => {
  await db.execute(
    `
    UPDATE doctor_working_hours
    SET weekday = ?, start_time = ?, end_time = ?
    WHERE id = ?
    `,
    [weekday, startTime, endTime, scheduleId]
  );
};

const deleteWorkingHour = async (scheduleId) => {
  await db.execute(
    `
    DELETE FROM doctor_working_hours
    WHERE id = ?
    `,
    [scheduleId]
  );
};

module.exports = {
  getDoctorById,
  getClinicDoctorsOptions,
  getAdminDoctorsOptions,
  getDoctorWorkingHours,
  clinicCanManageDoctor,
  getWorkingHourById,
  hasScheduleOverlap,
  createWorkingHour,
  updateWorkingHour,
  deleteWorkingHour,
};