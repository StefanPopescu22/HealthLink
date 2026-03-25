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

const getClinicServices = async (clinicUserId) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return null;

  const [rows] = await db.execute(
    `
    SELECT
      cs.id,
      cs.clinic_id,
      cs.service_id,
      cs.price,
      s.name,
      s.category,
      s.description,
      s.duration_minutes
    FROM clinic_services cs
    INNER JOIN services s ON s.id = cs.service_id
    WHERE cs.clinic_id = ?
    ORDER BY s.name ASC
    `,
    [clinic.id]
  );

  return {
    clinic,
    services: rows,
  };
};

const addClinicService = async (clinicUserId, serviceId, price) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return { clinicNotFound: true };

  await db.execute(
    `
    INSERT INTO clinic_services (clinic_id, service_id, price)
    VALUES (?, ?, ?)
    `,
    [clinic.id, serviceId, price || null]
  );

  return { success: true };
};

const updateClinicService = async (clinicUserId, clinicServiceId, price) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return { clinicNotFound: true };

  const [rows] = await db.execute(
    `
    SELECT *
    FROM clinic_services
    WHERE id = ? AND clinic_id = ?
    `,
    [clinicServiceId, clinic.id]
  );

  if (!rows[0]) return { notFound: true };

  await db.execute(
    `
    UPDATE clinic_services
    SET price = ?
    WHERE id = ?
    `,
    [price || null, clinicServiceId]
  );

  return { success: true };
};

const deleteClinicService = async (clinicUserId, clinicServiceId) => {
  const clinic = await getClinicByUserId(clinicUserId);
  if (!clinic) return { clinicNotFound: true };

  const [rows] = await db.execute(
    `
    SELECT *
    FROM clinic_services
    WHERE id = ? AND clinic_id = ?
    `,
    [clinicServiceId, clinic.id]
  );

  if (!rows[0]) return { notFound: true };

  await db.execute(
    `
    DELETE FROM clinic_services
    WHERE id = ?
    `,
    [clinicServiceId]
  );

  return { success: true };
};

module.exports = {
  getClinicServices,
  addClinicService,
  updateClinicService,
  deleteClinicService,
};