const db = require("../config/db");

const getAllDoctorsForAdmin = async () => {
  const [rows] = await db.execute(
    `
    SELECT
      d.id,
      d.user_id,
      d.clinic_id,
      d.first_name,
      d.last_name,
      d.description,
      d.experience_years,
      d.schedule_info,
      u.email,
      u.phone,
      u.is_blocked,
      c.name AS clinic_name,
      COALESCE(
        GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', '),
        ''
      ) AS specialties
    FROM doctors d
    INNER JOIN users u ON u.id = d.user_id
    LEFT JOIN clinics c ON c.id = d.clinic_id
    LEFT JOIN doctor_specialties ds ON ds.doctor_id = d.id
    LEFT JOIN specialties s ON s.id = ds.specialty_id
    GROUP BY d.id
    ORDER BY d.first_name, d.last_name
    `
  );

  return rows;
};

const getDoctorByIdForAdmin = async (doctorId) => {
  const [rows] = await db.execute(
    `
    SELECT
      d.id,
      d.user_id,
      d.clinic_id
    FROM doctors d
    WHERE d.id = ?
    `,
    [doctorId]
  );

  return rows[0];
};

const updateDoctorByAdmin = async (doctorId, payload) => {
  const doctor = await getDoctorByIdForAdmin(doctorId);
  if (!doctor) return { notFound: true };

  const {
    firstName,
    lastName,
    phone,
    description,
    experienceYears,
    scheduleInfo,
  } = payload;

  await db.execute(
    `
    UPDATE users
    SET phone = ?
    WHERE id = ?
    `,
    [phone || null, doctor.user_id]
  );

  await db.execute(
    `
    UPDATE doctors
    SET
      first_name = ?,
      last_name = ?,
      description = ?,
      experience_years = ?,
      schedule_info = ?
    WHERE id = ?
    `,
    [
      firstName || null,
      lastName || null,
      description || null,
      Number(experienceYears) || 0,
      scheduleInfo || null,
      doctorId,
    ]
  );

  return { success: true };
};

module.exports = {
  getAllDoctorsForAdmin,
  updateDoctorByAdmin,
};