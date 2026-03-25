const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const bcrypt = require("bcrypt");
const db = require("../config/db");

async function getUserByEmail(email) {
  const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0];
}

async function ensureUser({ firstName, lastName, email, password, role, phone = null }) {
  const existing = await getUserByEmail(email);
  if (existing) return existing.id;

  const passwordHash = await bcrypt.hash(password, 10);

  const [result] = await db.execute(
    `
    INSERT INTO users (first_name, last_name, email, password_hash, role, phone)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [firstName, lastName, email, passwordHash, role, phone]
  );

  return result.insertId;
}

async function ensureClinicProfile({ userId, name, clinicType, city, address, phone, email, description }) {
  const [rows] = await db.execute(`SELECT * FROM clinics WHERE user_id = ?`, [userId]);
  if (rows[0]) return rows[0].id;

  const [result] = await db.execute(
    `
    INSERT INTO clinics (user_id, name, clinic_type, city, address, phone, email, description, approved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `,
    [userId, name, clinicType, city, address, phone, email, description]
  );

  return result.insertId;
}

async function ensureSpecialty(name, description) {
  const [rows] = await db.execute(`SELECT * FROM specialties WHERE name = ?`, [name]);
  if (rows[0]) return rows[0].id;

  const [result] = await db.execute(
    `
    INSERT INTO specialties (name, description)
    VALUES (?, ?)
    `,
    [name, description]
  );

  return result.insertId;
}

async function ensureService(name, category, description, durationMinutes) {
  const [rows] = await db.execute(`SELECT * FROM services WHERE name = ?`, [name]);
  if (rows[0]) return rows[0].id;

  const [result] = await db.execute(
    `
    INSERT INTO services (name, category, description, duration_minutes)
    VALUES (?, ?, ?, ?)
    `,
    [name, category, description, durationMinutes]
  );

  return result.insertId;
}

async function ensureDoctorProfile({
  userId,
  clinicId,
  firstName,
  lastName,
  description,
  experienceYears,
  scheduleInfo,
}) {
  const [rows] = await db.execute(`SELECT * FROM doctors WHERE user_id = ?`, [userId]);
  if (rows[0]) return rows[0].id;

  const [result] = await db.execute(
    `
    INSERT INTO doctors (user_id, clinic_id, first_name, last_name, description, experience_years, schedule_info)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [userId, clinicId, firstName, lastName, description, experienceYears, scheduleInfo]
  );

  return result.insertId;
}

async function ensureDoctorSpecialty(doctorId, specialtyId) {
  await db.execute(
    `
    INSERT IGNORE INTO doctor_specialties (doctor_id, specialty_id)
    VALUES (?, ?)
    `,
    [doctorId, specialtyId]
  );
}

async function ensureClinicService(clinicId, serviceId, price) {
  await db.execute(
    `
    INSERT INTO clinic_services (clinic_id, service_id, price)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE price = VALUES(price)
    `,
    [clinicId, serviceId, price]
  );
}

async function ensureReview(userId, clinicId, rating, comment) {
  await db.execute(
    `
    INSERT INTO reviews (user_id, clinic_id, rating, comment)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)
    `,
    [userId, clinicId, rating, comment]
  );
}

async function ensureFavorite(userId, clinicId) {
  await db.execute(
    `
    INSERT IGNORE INTO favorites (user_id, clinic_id)
    VALUES (?, ?)
    `,
    [userId, clinicId]
  );
}

async function runSeed() {
  try {
    console.log("Seeding HealthLink data...");

    const adminId = await ensureUser({
      firstName: "System",
      lastName: "Admin",
      email: "admin@healthlink.com",
      password: "admin123",
      role: "admin",
      phone: "+40700000001",
    });

    const patientId = await ensureUser({
      firstName: "Test",
      lastName: "Patient",
      email: "patient@healthlink.com",
      password: "patient123",
      role: "patient",
      phone: "+40700000002",
    });

    const clinicUserId = await ensureUser({
      firstName: "Central",
      lastName: "Clinic",
      email: "clinic@healthlink.com",
      password: "clinic123",
      role: "clinic",
      phone: "+40700000003",
    });

    const clinicId = await ensureClinicProfile({
      userId: clinicUserId,
      name: "Central Medical Point",
      clinicType: "clinic",
      city: "Bucharest",
      address: "Main Street 10",
      phone: "+40700000003",
      email: "clinic@healthlink.com",
      description: "Modern multidisciplinary clinic.",
    });

    const cardiologyId = await ensureSpecialty("Cardiology", "Heart and cardiovascular care");
    const dermatologyId = await ensureSpecialty("Dermatology", "Skin and dermatological care");
    const internalMedicineId = await ensureSpecialty("Internal Medicine", "General adult medicine");
    const neurologyId = await ensureSpecialty("Neurology", "Neurological evaluation and treatment");

    const cardiologyServiceId = await ensureService(
      "Cardiology Consultation",
      "Consultation",
      "Heart and cardiovascular consultation",
      30
    );

    const dermatologyServiceId = await ensureService(
      "Dermatology Consultation",
      "Consultation",
      "Skin evaluation and treatment planning",
      25
    );

    const checkupServiceId = await ensureService(
      "Preventive Check-up",
      "Screening",
      "Routine preventive medical check-up",
      45
    );

    await ensureClinicService(clinicId, cardiologyServiceId, 250);
    await ensureClinicService(clinicId, dermatologyServiceId, 220);
    await ensureClinicService(clinicId, checkupServiceId, 180);

    const doctorUserId = await ensureUser({
      firstName: "Elena",
      lastName: "Popescu",
      email: "doctor@healthlink.com",
      password: "doctor123",
      role: "doctor",
      phone: "+40700000004",
    });

    const doctorId = await ensureDoctorProfile({
      userId: doctorUserId,
      clinicId,
      firstName: "Elena",
      lastName: "Popescu",
      description: "Experienced specialist focused on integrated care.",
      experienceYears: 12,
      scheduleInfo: "Monday 09:00 - 15:00, Wednesday 10:00 - 16:00",
    });

    await ensureDoctorSpecialty(doctorId, cardiologyId);
    await ensureDoctorSpecialty(doctorId, internalMedicineId);

    await ensureReview(patientId, clinicId, 5, "Very professional clinic with fast scheduling.");
    await ensureFavorite(patientId, clinicId);

    console.log("Seed completed successfully.");
    console.log({
      adminId,
      patientId,
      clinicUserId,
      clinicId,
      doctorUserId,
      doctorId,
      specialties: [cardiologyId, dermatologyId, internalMedicineId, neurologyId],
    });
  } catch (error) {
    console.error("Seed failed:", error.message);
  } finally {
    process.exit(0);
  }
}

runSeed();