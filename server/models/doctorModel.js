const db = require("../config/db");

const getExecutor = (connection) => connection || db;

const createDoctorProfile = async (
  {
    userId,
    clinicId,
    firstName,
    lastName,
    description,
    experienceYears,
    scheduleInfo,
  },
  connection = null
) => {
  const executor = getExecutor(connection);

  const [result] = await executor.execute(
    `INSERT INTO doctors (user_id, clinic_id, first_name, last_name, description, experience_years, schedule_info)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, clinicId, firstName, lastName, description, experienceYears, scheduleInfo]
  );

  return result.insertId;
};

const attachDoctorSpecialties = async (doctorId, specialtyIds, connection = null) => {
  const executor = getExecutor(connection);

  for (const specialtyId of specialtyIds) {
    await executor.execute(
      `INSERT INTO doctor_specialties (doctor_id, specialty_id)
       VALUES (?, ?)`,
      [doctorId, specialtyId]
    );
  }
};

module.exports = {
  createDoctorProfile,
  attachDoctorSpecialties,
};