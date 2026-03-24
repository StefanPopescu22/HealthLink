const db = require("../config/db");

const listPublicClinics = async () => {
  const [rows] = await db.execute(
    `
    SELECT
      c.id,
      c.name,
      c.clinic_type,
      c.city,
      c.address,
      c.phone,
      c.email,
      c.description,
      c.approved,
      COUNT(DISTINCT d.id) AS doctors_count,
      COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
    FROM clinics c
    LEFT JOIN doctors d ON d.clinic_id = c.id
    LEFT JOIN reviews r ON r.clinic_id = c.id
    WHERE c.approved = 1
    GROUP BY c.id
    ORDER BY c.name ASC
    `
  );

  return rows;
};

const getPublicClinicById = async (clinicId) => {
  const [rows] = await db.execute(
    `
    SELECT
      c.id,
      c.name,
      c.clinic_type,
      c.city,
      c.address,
      c.phone,
      c.email,
      c.description,
      c.approved,
      COUNT(DISTINCT d.id) AS doctors_count,
      COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
    FROM clinics c
    LEFT JOIN doctors d ON d.clinic_id = c.id
    LEFT JOIN reviews r ON r.clinic_id = c.id
    WHERE c.id = ? AND c.approved = 1
    GROUP BY c.id
    `,
    [clinicId]
  );

  return rows[0];
};

const getClinicDoctors = async (clinicId) => {
  const [rows] = await db.execute(
    `
    SELECT
      d.id,
      d.first_name,
      d.last_name,
      d.description,
      d.experience_years,
      d.schedule_info,
      COALESCE(
        GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', '),
        ''
      ) AS specialties
    FROM doctors d
    LEFT JOIN doctor_specialties ds ON ds.doctor_id = d.id
    LEFT JOIN specialties s ON s.id = ds.specialty_id
    WHERE d.clinic_id = ?
    GROUP BY d.id
    ORDER BY d.first_name, d.last_name
    `,
    [clinicId]
  );

  return rows;
};

const getClinicReviews = async (clinicId) => {
  const [rows] = await db.execute(
    `
    SELECT
      r.id,
      r.comment,
      r.rating,
      r.created_at,
      u.first_name,
      u.last_name
    FROM reviews r
    INNER JOIN users u ON u.id = r.user_id
    WHERE r.clinic_id = ?
    ORDER BY r.created_at DESC
    LIMIT 10
    `,
    [clinicId]
  );

  return rows;
};

const listPublicDoctors = async () => {
  const [rows] = await db.execute(
    `
    SELECT
      d.id,
      d.first_name,
      d.last_name,
      d.description,
      d.experience_years,
      d.schedule_info,
      c.id AS clinic_id,
      c.name AS clinic_name,
      COALESCE(
        GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', '),
        ''
      ) AS specialties,
      COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
    FROM doctors d
    INNER JOIN clinics c ON c.id = d.clinic_id
    LEFT JOIN doctor_specialties ds ON ds.doctor_id = d.id
    LEFT JOIN specialties s ON s.id = ds.specialty_id
    LEFT JOIN reviews r ON r.clinic_id = c.id
    GROUP BY d.id
    ORDER BY d.first_name, d.last_name
    `
  );

  return rows;
};

const getPublicDoctorById = async (doctorId) => {
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
      c.id AS clinic_id,
      c.name AS clinic_name,
      c.city AS clinic_city,
      COALESCE(
        GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', '),
        ''
      ) AS specialties,
      COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
    FROM doctors d
    INNER JOIN clinics c ON c.id = d.clinic_id
    LEFT JOIN doctor_specialties ds ON ds.doctor_id = d.id
    LEFT JOIN specialties s ON s.id = ds.specialty_id
    LEFT JOIN reviews r ON r.clinic_id = c.id
    WHERE d.id = ?
    GROUP BY d.id
    `,
    [doctorId]
  );

  return rows[0];
};

module.exports = {
  listPublicClinics,
  getPublicClinicById,
  getClinicDoctors,
  getClinicReviews,
  listPublicDoctors,
  getPublicDoctorById,
};