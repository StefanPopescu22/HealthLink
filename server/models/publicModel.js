const db = require("../config/db");

const listPublicClinics = async (filters = {}) => {
  const { q, city, specialty, minRating, sort } = filters;

  let sql = `
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
  `;

  const params = [];

  if (q) {
    sql += ` AND (c.name LIKE ? OR c.description LIKE ?) `;
    params.push(`%${q}%`, `%${q}%`);
  }

  if (city) {
    sql += ` AND c.city LIKE ? `;
    params.push(`%${city}%`);
  }

  if (specialty) {
    sql += `
      AND EXISTS (
        SELECT 1
        FROM doctors d2
        LEFT JOIN doctor_specialties ds2 ON ds2.doctor_id = d2.id
        LEFT JOIN specialties s2 ON s2.id = ds2.specialty_id
        WHERE d2.clinic_id = c.id
          AND s2.name LIKE ?
      )
    `;
    params.push(`%${specialty}%`);
  }

  sql += ` GROUP BY c.id `;

  if (minRating) {
    sql += ` HAVING COALESCE(ROUND(AVG(r.rating), 1), 0) >= ? `;
    params.push(Number(minRating));
  }

  if (sort === "rating") {
    sql += ` ORDER BY rating DESC, c.name ASC `;
  } else if (sort === "doctors") {
    sql += ` ORDER BY doctors_count DESC, c.name ASC `;
  } else {
    sql += ` ORDER BY c.name ASC `;
  }

  const [rows] = await db.query(sql, params);
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
      r.updated_at,
      u.first_name,
      u.last_name
    FROM reviews r
    INNER JOIN users u ON u.id = r.user_id
    WHERE r.clinic_id = ?
    ORDER BY r.updated_at DESC, r.created_at DESC
    `,
    [clinicId]
  );

  return rows;
};

const listPublicDoctors = async (filters = {}) => {
  const { q, specialty, clinicId } = filters;

  let sql = `
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
    WHERE 1 = 1
  `;

  const params = [];

  if (q) {
    sql += `
      AND (
        d.first_name LIKE ?
        OR d.last_name LIKE ?
        OR c.name LIKE ?
        OR d.description LIKE ?
      )
    `;
    params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  }

  if (specialty) {
    sql += ` AND s.name LIKE ? `;
    params.push(`%${specialty}%`);
  }

  if (clinicId) {
    sql += ` AND c.id = ? `;
    params.push(Number(clinicId));
  }

  sql += `
    GROUP BY d.id
    ORDER BY d.first_name ASC, d.last_name ASC
  `;

  const [rows] = await db.query(sql, params);
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

const listPublicServices = async (filters = {}) => {
  const { q, category, clinicId } = filters;

  let sql = `
    SELECT
      s.id,
      s.name,
      s.category,
      s.description,
      s.duration_minutes,
      COUNT(DISTINCT cs.clinic_id) AS clinics_count,
      MIN(cs.price) AS starting_price
    FROM services s
    LEFT JOIN clinic_services cs ON cs.service_id = s.id
    WHERE 1 = 1
  `;

  const params = [];

  if (q) {
    sql += ` AND (s.name LIKE ? OR s.description LIKE ?) `;
    params.push(`%${q}%`, `%${q}%`);
  }

  if (category) {
    sql += ` AND s.category LIKE ? `;
    params.push(`%${category}%`);
  }

  if (clinicId) {
    sql += `
      AND EXISTS (
        SELECT 1
        FROM clinic_services cs2
        WHERE cs2.service_id = s.id AND cs2.clinic_id = ?
      )
    `;
    params.push(Number(clinicId));
  }

  sql += `
    GROUP BY s.id
    ORDER BY s.name ASC
  `;

  const [rows] = await db.query(sql, params);
  return rows;
};

module.exports = {
  listPublicClinics,
  getPublicClinicById,
  getClinicDoctors,
  getClinicReviews,
  listPublicDoctors,
  getPublicDoctorById,
  listPublicServices,
};