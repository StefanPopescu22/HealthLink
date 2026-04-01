const db = require("../config/db");
const { getDoctorDocumentsByPatient } = require("./documentModel");
const { getDoctorAnalysesByPatient } = require("./analysisModel");

/**
 * Recuperează datele de profil ale doctorului pe baza user_id-ului din tabelul users
 */
const getDoctorByUserId = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT id, user_id, clinic_id, first_name, last_name
    FROM doctors
    WHERE user_id = ?
    `,
    [userId]
  );
  return rows[0];
};

/**
 * Recuperează lista de pacienți unici care au avut cel puțin o programare la acest doctor
 */
const getDoctorPatients = async (doctorUserId) => {
  try {
    const doctor = await getDoctorByUserId(doctorUserId);
    if (!doctor) return null;

    const [rows] = await db.execute(
      `
      SELECT
        u.id AS patient_user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        MAX(a.appointment_date) AS last_appointment_date,
        COUNT(a.id) AS appointments_count
      FROM appointments a
      INNER JOIN users u ON u.id = a.patient_user_id
      WHERE a.doctor_id = ?
      GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone
      ORDER BY last_appointment_date DESC
      `,
      [doctor.id]
    );

    return {
      doctor,
      patients: rows || [],
    };
  } catch (error) {
    console.error("Error in getDoctorPatients:", error.message);
    throw error;
  }
};

/**
 * Recuperează toate detaliile unui pacient (profil, alergii, programări, note, documente, analize)
 * Verifică de asemenea dacă doctorul are dreptul să vadă acest pacient
 */
const getDoctorPatientDetails = async (doctorUserId, patientUserId) => {
  try {
    const doctor = await getDoctorByUserId(doctorUserId);
    if (!doctor) return null;

    // 1. Informații de bază pacient și profil medical
    const [patientRows] = await db.execute(
      `
      SELECT
        u.id, u.first_name, u.last_name, u.email, u.phone,
        pp.date_of_birth, pp.gender, pp.blood_group,
        pp.emergency_contact_name, pp.emergency_contact_phone, pp.medical_notes
      FROM users u
      LEFT JOIN patient_profiles pp ON pp.user_id = u.id
      WHERE u.id = ? AND u.role = 'patient'
      `,
      [patientUserId]
    );

    const patient = patientRows[0];
    if (!patient) return null;

    // 2. Verificare acces: doctorul poate vedea pacientul doar dacă au/au avut programări împreună
    const [ownershipRows] = await db.execute(
      `SELECT COUNT(*) AS total FROM appointments WHERE doctor_id = ? AND patient_user_id = ?`,
      [doctor.id, patientUserId]
    );

    if (!ownershipRows[0] || ownershipRows[0].total === 0) {
      return { forbidden: true };
    }

    // 3. Alergii pacient
    const [allergyRows] = await db.execute(
      `SELECT id, allergy_name FROM patient_allergies WHERE user_id = ? ORDER BY allergy_name ASC`,
      [patientUserId]
    );

    // 4. Istoric programări cu acest doctor
    const [appointmentRows] = await db.execute(
      `SELECT id, appointment_date, appointment_time, status, notes 
       FROM appointments 
       WHERE doctor_id = ? AND patient_user_id = ?
       ORDER BY appointment_date DESC, appointment_time DESC`,
      [doctor.id, patientUserId]
    );

    // 5. Note medicale lăsate de doctori pentru acest pacient
    const [noteRows] = await db.execute(
      `SELECT id, note_text, recommendation_text, created_at, appointment_id
       FROM doctor_notes 
       WHERE doctor_id = ? AND patient_user_id = ?
       ORDER BY created_at DESC`,
      [doctor.id, patientUserId]
    );

    // 6. Documente și Analize - Aici folosim un sub-bloc try-catch 
    // pentru a preveni crash-ul total dacă funcțiile din celelalte modele au erori
    let documents = [];
    let analyses = [];

    try {
      // Notă: Verifică în documentModel.js dacă aceste funcții primesc DOAR patientUserId
      documents = await getDoctorDocumentsByPatient(patientUserId);
      analyses = await getDoctorAnalysesByPatient(patientUserId);
    } catch (err) {
      console.warn("Could not load external docs/analyses for patient details:", err.message);
    }

    return {
      doctor,
      patient,
      allergies: allergyRows || [],
      appointments: appointmentRows || [],
      notes: noteRows || [],
      documents: documents || [],
      analyses: analyses || [],
    };
  } catch (error) {
    console.error("Error in getDoctorPatientDetails:", error.message);
    throw error;
  }
};

/**
 * Creează o notă medicală nouă pentru un pacient
 */
const createDoctorNote = async ({
  doctorUserId,
  patientUserId,
  appointmentId,
  noteText,
  recommendationText,
}) => {
  try {
    const doctor = await getDoctorByUserId(doctorUserId);
    if (!doctor) return { doctorNotFound: true };

    // Verificăm din nou permisiunea înainte de inserare
    const [ownershipRows] = await db.execute(
      `SELECT COUNT(*) AS total FROM appointments WHERE doctor_id = ? AND patient_user_id = ?`,
      [doctor.id, patientUserId]
    );

    if (!ownershipRows[0] || ownershipRows[0].total === 0) {
      return { forbidden: true };
    }

    const [result] = await db.execute(
      `
      INSERT INTO doctor_notes 
      (doctor_id, patient_user_id, appointment_id, note_text, recommendation_text, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
      `,
      [
        doctor.id,
        patientUserId,
        appointmentId || null,
        noteText,
        recommendationText || null,
      ]
    );

    return { noteId: result.insertId };
  } catch (error) {
    console.error("Error in createDoctorNote:", error.message);
    throw error;
  }
};

module.exports = {
  getDoctorPatients,
  getDoctorPatientDetails,
  createDoctorNote,
};