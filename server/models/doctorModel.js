const weekdayLabels = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const createDoctorProfile = async (connection, data) => {
  const {
    userId,
    clinicId,
    firstName,
    lastName,
    description,
    experienceYears,
    scheduleInfo,
  } = data;

  const [result] = await connection.execute(
    `
    INSERT INTO doctors
    (user_id, clinic_id, first_name, last_name, description, experience_years, schedule_info)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      clinicId,
      firstName,
      lastName,
      description || null,
      Number(experienceYears) || 0,
      scheduleInfo || null,
    ]
  );

  return result.insertId;
};

const attachDoctorSpecialties = async (connection, doctorId, specialtyIds) => {
  const uniqueIds = [...new Set((specialtyIds || []).map(Number).filter(Boolean))];

  for (const specialtyId of uniqueIds) {
    await connection.execute(
      `
      INSERT INTO doctor_specialties (doctor_id, specialty_id)
      VALUES (?, ?)
      `,
      [doctorId, specialtyId]
    );
  }
};

const insertDoctorWorkingHours = async (connection, doctorId, workingHours) => {
  for (const item of workingHours) {
    await connection.execute(
      `
      INSERT INTO doctor_working_hours
      (doctor_id, weekday, start_time, end_time)
      VALUES (?, ?, ?, ?)
      `,
      [doctorId, Number(item.weekday), item.startTime, item.endTime]
    );
  }
};

const buildDoctorScheduleSummary = (workingHours) => {
  if (!Array.isArray(workingHours) || workingHours.length === 0) {
    return null;
  }

  const byDay = {};

  for (const item of workingHours) {
    const weekday = Number(item.weekday);
    if (!byDay[weekday]) byDay[weekday] = [];
    byDay[weekday].push(`${item.startTime} - ${item.endTime}`);
  }

  return Object.entries(byDay)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([weekday, intervals]) => `${weekdayLabels[weekday]} ${intervals.join(", ")}`)
    .join("; ");
};

module.exports = {
  createDoctorProfile,
  attachDoctorSpecialties,
  insertDoctorWorkingHours,
  buildDoctorScheduleSummary,
};