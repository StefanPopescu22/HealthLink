const db = require("../config/db");

const getAllServices = async () => {
  const [rows] = await db.execute(
    `
    SELECT
      s.id,
      s.name,
      s.specialty_id,
      sp.name AS specialty_name,
      s.category,
      s.description,
      s.duration_minutes,
      COUNT(DISTINCT cs.clinic_id) AS clinics_count
    FROM services s
    LEFT JOIN specialties sp ON sp.id = s.specialty_id
    LEFT JOIN clinic_services cs ON cs.service_id = s.id
    GROUP BY s.id
    ORDER BY s.name ASC
    `
  );

  return rows;
};

const createService = async ({
  name,
  specialtyId,
  category,
  description,
  durationMinutes,
}) => {
  const [result] = await db.execute(
    `
    INSERT INTO services (name, specialty_id, category, description, duration_minutes)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      name,
      specialtyId || null,
      category || null,
      description || null,
      Number(durationMinutes) || 30,
    ]
  );

  return result.insertId;
};

const updateService = async (
  serviceId,
  { name, specialtyId, category, description, durationMinutes }
) => {
  await db.execute(
    `
    UPDATE services
    SET
      name = ?,
      specialty_id = ?,
      category = ?,
      description = ?,
      duration_minutes = ?
    WHERE id = ?
    `,
    [
      name,
      specialtyId || null,
      category || null,
      description || null,
      Number(durationMinutes) || 30,
      serviceId,
    ]
  );
};

const deleteService = async (serviceId) => {
  await db.execute(
    `
    DELETE FROM services
    WHERE id = ?
    `,
    [serviceId]
  );
};

const getAllSpecialties = async () => {
  const [rows] = await db.execute(
    `
    SELECT
      s.id,
      s.name,
      s.description,
      COUNT(DISTINCT ds.doctor_id) AS doctors_count,
      COUNT(DISTINCT srv.id) AS services_count
    FROM specialties s
    LEFT JOIN doctor_specialties ds ON ds.specialty_id = s.id
    LEFT JOIN services srv ON srv.specialty_id = s.id
    GROUP BY s.id
    ORDER BY s.name ASC
    `
  );

  return rows;
};

const createSpecialty = async ({ name, description }) => {
  const [result] = await db.execute(
    `
    INSERT INTO specialties (name, description)
    VALUES (?, ?)
    `,
    [name, description || null]
  );

  return result.insertId;
};

const updateSpecialty = async (specialtyId, { name, description }) => {
  await db.execute(
    `
    UPDATE specialties
    SET name = ?, description = ?
    WHERE id = ?
    `,
    [name, description || null, specialtyId]
  );
};

const deleteSpecialty = async (specialtyId) => {
  await db.execute(
    `
    DELETE FROM specialties
    WHERE id = ?
    `,
    [specialtyId]
  );
};

module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getAllSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
};