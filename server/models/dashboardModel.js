const db = require("../config/db");

const getDoctorByUserId = async (userId) => {
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
      COALESCE(
        GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', '),
        ''
      ) AS specialties
    FROM doctors d
    LEFT JOIN clinics c ON c.id = d.clinic_id
    LEFT JOIN doctor_specialties ds ON ds.doctor_id = d.id
    LEFT JOIN specialties s ON s.id = ds.specialty_id
    WHERE d.user_id = ?
    GROUP BY d.id
    `,
    [userId]
  );

  return rows[0];
};

const getClinicByUserId = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      user_id,
      name,
      clinic_type,
      city,
      address,
      phone,
      email,
      description,
      approved,
      created_at
    FROM clinics
    WHERE user_id = ?
    `,
    [userId]
  );

  return rows[0];
};

const getDoctorDashboardData = async (userId) => {
  const doctor = await getDoctorByUserId(userId);

  if (!doctor) return null;

  const [todayRows] = await db.execute(
    `
    SELECT COUNT(*) AS total
    FROM appointments
    WHERE doctor_id = ? AND appointment_date = CURDATE()
    `,
    [doctor.id]
  );

  const [activePatientsRows] = await db.execute(
    `
    SELECT COUNT(DISTINCT patient_user_id) AS total
    FROM appointments
    WHERE doctor_id = ? AND status <> 'cancelled'
    `,
    [doctor.id]
  );

  const [upcomingRows] = await db.execute(
    `
    SELECT COUNT(*) AS total
    FROM appointments
    WHERE doctor_id = ?
      AND status IN ('pending', 'confirmed')
      AND appointment_date >= CURDATE()
    `,
    [doctor.id]
  );

  const [ratingRows] = await db.execute(
    `
    SELECT COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
    FROM reviews r
    WHERE r.clinic_id = ?
    `,
    [doctor.clinic_id]
  );

  const [todaySchedule] = await db.execute(
    `
    SELECT
      a.id,
      a.appointment_date,
      a.appointment_time,
      a.status,
      a.notes,
      u.first_name AS patient_first_name,
      u.last_name AS patient_last_name
    FROM appointments a
    INNER JOIN users u ON u.id = a.patient_user_id
    WHERE a.doctor_id = ?
    ORDER BY a.appointment_date ASC, a.appointment_time ASC
    LIMIT 8
    `,
    [doctor.id]
  );

  const [recentPatients] = await db.execute(
    `
    SELECT
      u.id AS patient_user_id,
      u.first_name,
      u.last_name,
      u.phone,
      MAX(a.appointment_date) AS last_appointment_date
    FROM appointments a
    INNER JOIN users u ON u.id = a.patient_user_id
    WHERE a.doctor_id = ?
    GROUP BY u.id, u.first_name, u.last_name, u.phone
    ORDER BY last_appointment_date DESC
    LIMIT 6
    `,
    [doctor.id]
  );

  return {
    doctor,
    stats: {
      todayAppointments: todayRows[0]?.total || 0,
      activePatients: activePatientsRows[0]?.total || 0,
      upcomingAppointments: upcomingRows[0]?.total || 0,
      rating: ratingRows[0]?.rating || 0,
    },
    todaySchedule,
    recentPatients,
  };
};

const getClinicDashboardData = async (userId) => {
  const clinic = await getClinicByUserId(userId);

  if (!clinic) return null;

  const [weeklyAppointmentsRows] = await db.execute(
    `
    SELECT COUNT(*) AS total
    FROM appointments
    WHERE clinic_id = ?
      AND YEARWEEK(appointment_date, 1) = YEARWEEK(CURDATE(), 1)
    `,
    [clinic.id]
  );

  const [doctorsCountRows] = await db.execute(
    `
    SELECT COUNT(*) AS total
    FROM doctors
    WHERE clinic_id = ?
    `,
    [clinic.id]
  );

  const [specialtiesCountRows] = await db.execute(
    `
    SELECT COUNT(DISTINCT ds.specialty_id) AS total
    FROM doctors d
    LEFT JOIN doctor_specialties ds ON ds.doctor_id = d.id
    WHERE d.clinic_id = ?
    `,
    [clinic.id]
  );

  const [ratingRows] = await db.execute(
    `
    SELECT COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
    FROM reviews r
    WHERE r.clinic_id = ?
    `,
    [clinic.id]
  );

  const [doctors] = await db.execute(
    `
    SELECT
      d.id,
      d.first_name,
      d.last_name,
      COALESCE(
        GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', '),
        ''
      ) AS specialties,
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM appointments a
          WHERE a.doctor_id = d.id
            AND a.appointment_date = CURDATE()
            AND a.status IN ('pending', 'confirmed')
        )
        THEN 'Busy'
        ELSE 'Available'
      END AS status
    FROM doctors d
    LEFT JOIN doctor_specialties ds ON ds.doctor_id = d.id
    LEFT JOIN specialties s ON s.id = ds.specialty_id
    WHERE d.clinic_id = ?
    GROUP BY d.id
    ORDER BY d.first_name, d.last_name
    `,
    [clinic.id]
  );

  const [bookings] = await db.execute(
    `
    SELECT
      a.id,
      a.appointment_date,
      a.appointment_time,
      a.status,
      u.first_name AS patient_first_name,
      u.last_name AS patient_last_name,
      d.first_name AS doctor_first_name,
      d.last_name AS doctor_last_name
    FROM appointments a
    INNER JOIN users u ON u.id = a.patient_user_id
    INNER JOIN doctors d ON d.id = a.doctor_id
    WHERE a.clinic_id = ?
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
    LIMIT 8
    `,
    [clinic.id]
  );

  return {
    clinic,
    stats: {
      weeklyAppointments: weeklyAppointmentsRows[0]?.total || 0,
      doctorsCount: doctorsCountRows[0]?.total || 0,
      specialtiesCount: specialtiesCountRows[0]?.total || 0,
      rating: ratingRows[0]?.rating || 0,
    },
    doctors,
    bookings,
  };
};

const getAdminDashboardData = async () => {
  const [usersRows] = await db.execute(`SELECT COUNT(*) AS total FROM users`);
  const [clinicsRows] = await db.execute(`SELECT COUNT(*) AS total FROM clinics`);
  const [doctorsRows] = await db.execute(`SELECT COUNT(*) AS total FROM doctors`);
  const [ratingRows] = await db.execute(
    `
    SELECT COALESCE(ROUND(AVG(rating), 1), 0) AS rating
    FROM reviews
    `
  );

  const [latestClinics] = await db.execute(
    `
    SELECT
      id,
      name,
      city,
      approved,
      created_at
    FROM clinics
    ORDER BY created_at DESC
    LIMIT 6
    `
  );

  const [latestDoctors] = await db.execute(
    `
    SELECT
      d.id,
      d.first_name,
      d.last_name,
      d.experience_years,
      c.name AS clinic_name,
      u.created_at
    FROM doctors d
    INNER JOIN clinics c ON c.id = d.clinic_id
    INNER JOIN users u ON u.id = d.user_id
    ORDER BY u.created_at DESC
    LIMIT 6
    `
  );

  const [usersByRole] = await db.execute(
    `
    SELECT role, COUNT(*) AS total
    FROM users
    GROUP BY role
    ORDER BY role
    `
  );

  return {
    stats: {
      registeredUsers: usersRows[0]?.total || 0,
      clinicsCount: clinicsRows[0]?.total || 0,
      doctorsCount: doctorsRows[0]?.total || 0,
      avgRating: ratingRows[0]?.rating || 0,
    },
    latestClinics,
    latestDoctors,
    usersByRole,
  };
};

module.exports = {
  getDoctorDashboardData,
  getClinicDashboardData,
  getAdminDashboardData,
};