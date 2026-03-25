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

const getClinicDoctorsList = async (clinicUserId) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return null;

  const [rows] = await db.execute(
    `
    SELECT
      d.id,
      d.user_id,
      d.first_name,
      d.last_name,
      d.description,
      d.experience_years,
      d.schedule_info,
      u.email,
      u.phone,
      u.is_blocked,
      COALESCE(
        GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', '),
        ''
      ) AS specialties
    FROM doctors d
    INNER JOIN users u ON u.id = d.user_id
    LEFT JOIN doctor_specialties ds ON ds.doctor_id = d.id
    LEFT JOIN specialties s ON s.id = ds.specialty_id
    WHERE d.clinic_id = ?
    GROUP BY d.id
    ORDER BY d.first_name, d.last_name
    `,
    [clinic.id]
  );

  return {
    clinic,
    doctors: rows,
  };
};

const updateClinicDoctor = async (clinicUserId, doctorId, payload) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return { clinicNotFound: true };

  const [doctorRows] = await db.execute(
    `
    SELECT d.id, d.user_id, d.clinic_id
    FROM doctors d
    WHERE d.id = ?
    `,
    [doctorId]
  );

  const doctor = doctorRows[0];
  if (!doctor) return { doctorNotFound: true };
  if (doctor.clinic_id !== clinic.id) return { forbidden: true };

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
  getClinicDoctorsList,
  updateClinicDoctor,
};