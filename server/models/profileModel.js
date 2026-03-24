const db = require("../config/db");

const getBaseUserById = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      first_name,
      last_name,
      email,
      role,
      phone,
      profile_image,
      created_at
    FROM users
    WHERE id = ?
    `,
    [userId]
  );

  return rows[0];
};

const getPatientProfile = async (userId) => {
  const [profileRows] = await db.execute(
    `
    SELECT
      user_id,
      date_of_birth,
      gender,
      blood_group,
      emergency_contact_name,
      emergency_contact_phone,
      medical_notes
    FROM patient_profiles
    WHERE user_id = ?
    `,
    [userId]
  );

  const [allergyRows] = await db.execute(
    `
    SELECT id, allergy_name
    FROM patient_allergies
    WHERE user_id = ?
    ORDER BY allergy_name ASC
    `,
    [userId]
  );

  return {
    patient_profile: profileRows[0] || null,
    allergies: allergyRows,
  };
};

const getDoctorProfile = async (userId) => {
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
      c.name AS clinic_name,
      c.city AS clinic_city,
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

  return rows[0] || null;
};

const getClinicProfile = async (userId) => {
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

  return rows[0] || null;
};

const getProfileByUserId = async (userId) => {
  const user = await getBaseUserById(userId);

  if (!user) return null;

  if (user.role === "patient") {
    const patientData = await getPatientProfile(userId);
    return {
      ...user,
      details: patientData.patient_profile,
      allergies: patientData.allergies,
    };
  }

  if (user.role === "doctor") {
    const doctorData = await getDoctorProfile(userId);
    return {
      ...user,
      details: doctorData,
      allergies: [],
    };
  }

  if (user.role === "clinic") {
    const clinicData = await getClinicProfile(userId);
    return {
      ...user,
      details: clinicData,
      allergies: [],
    };
  }

  return {
    ...user,
    details: null,
    allergies: [],
  };
};

const updateBaseUser = async (userId, phone) => {
  await db.execute(
    `
    UPDATE users
    SET phone = ?
    WHERE id = ?
    `,
    [phone || null, userId]
  );
};

const upsertPatientProfile = async (userId, profileData) => {
  const {
    phone,
    dateOfBirth,
    gender,
    bloodGroup,
    emergencyContactName,
    emergencyContactPhone,
    medicalNotes,
    allergies,
  } = profileData;

  await updateBaseUser(userId, phone);

  const [existingRows] = await db.execute(
    `SELECT id FROM patient_profiles WHERE user_id = ?`,
    [userId]
  );

  if (existingRows.length === 0) {
    await db.execute(
      `
      INSERT INTO patient_profiles
      (user_id, date_of_birth, gender, blood_group, emergency_contact_name, emergency_contact_phone, medical_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        dateOfBirth || null,
        gender || null,
        bloodGroup || null,
        emergencyContactName || null,
        emergencyContactPhone || null,
        medicalNotes || null,
      ]
    );
  } else {
    await db.execute(
      `
      UPDATE patient_profiles
      SET
        date_of_birth = ?,
        gender = ?,
        blood_group = ?,
        emergency_contact_name = ?,
        emergency_contact_phone = ?,
        medical_notes = ?
      WHERE user_id = ?
      `,
      [
        dateOfBirth || null,
        gender || null,
        bloodGroup || null,
        emergencyContactName || null,
        emergencyContactPhone || null,
        medicalNotes || null,
        userId,
      ]
    );
  }

  await db.execute(`DELETE FROM patient_allergies WHERE user_id = ?`, [userId]);

  if (Array.isArray(allergies) && allergies.length > 0) {
    for (const allergy of allergies) {
      const trimmed = String(allergy).trim();
      if (trimmed) {
        await db.execute(
          `
          INSERT INTO patient_allergies (user_id, allergy_name)
          VALUES (?, ?)
          `,
          [userId, trimmed]
        );
      }
    }
  }
};

const updateDoctorProfile = async (userId, profileData) => {
  const { phone, description, experienceYears, scheduleInfo } = profileData;

  await updateBaseUser(userId, phone);

  await db.execute(
    `
    UPDATE doctors
    SET
      description = ?,
      experience_years = ?,
      schedule_info = ?
    WHERE user_id = ?
    `,
    [
      description || null,
      Number(experienceYears) || 0,
      scheduleInfo || null,
      userId,
    ]
  );
};

const updateClinicProfile = async (userId, profileData) => {
  const { phone, city, address, description } = profileData;

  await updateBaseUser(userId, phone);

  await db.execute(
    `
    UPDATE clinics
    SET
      city = ?,
      address = ?,
      phone = ?,
      description = ?
    WHERE user_id = ?
    `,
    [
      city || null,
      address || null,
      phone || null,
      description || null,
      userId,
    ]
  );
};

module.exports = {
  getProfileByUserId,
  upsertPatientProfile,
  updateDoctorProfile,
  updateClinicProfile,
  updateBaseUser,
};