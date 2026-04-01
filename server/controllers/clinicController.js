const bcrypt = require("bcrypt");
const db = require("../config/db");
const { findClinicByUserId } = require("../models/clinicModel");
const { getDocumentsByPatient } = require("../models/documentModel");
const { getAnalysesByPatient } = require("../models/analysisModel");
const { findUserById } = require("../models/userModel");

const {
  isValidEmail,
  isValidPassword,
  isNonEmptyString,
  isValidWorkingHoursArray,
} = require("../utils/validators");

const getMyClinic = async (req, res) => {
  try {
    const clinic = await findClinicByUserId(req.user.id);

    if (!clinic) {
      return res.status(404).json({
        message: "Clinic profile not found.",
      });
    }

    return res.status(200).json(clinic);
  } catch (error) {
    console.error("Error in getMyClinic:", error.message);

    return res.status(500).json({
      message: "Failed to load clinic profile.",
      error: error.message,
    });
  }
};

const getPatientFilesForClinic = async (req, res) => {
  try {
    const patientUserId = Number(req.params.patientUserId);

    if (!Number.isInteger(patientUserId) || patientUserId <= 0) {
      return res.status(400).json({
        message: "Invalid patient user id.",
      });
    }

    const clinic = await findClinicByUserId(req.user.id);
    if (!clinic) {
      return res.status(404).json({
        message: "Clinic profile not found.",
      });
    }

    const patient = await findUserById(patientUserId);
    if (!patient) {
      return res.status(404).json({
        message: "Patient not found.",
      });
    }

    const documents = await getDocumentsByPatient(patientUserId);
    const analyses = await getAnalysesByPatient(patientUserId);

    return res.status(200).json({
      patient: {
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
      },
      documents: documents || [],
      analyses: analyses || [],
    });
  } catch (error) {
    console.error("Error in getPatientFilesForClinic:", error.message);

    return res.status(500).json({
      message: "Failed to load patient files.",
      error: error.message,
    });
  }
};

const createDoctorForOwnClinic = async (req, res) => {
  const connection = await db.getConnection(); 

  try {
    const {
      firstName, lastName, email, password,
      specialtyIds, experienceYears, description, workingHours
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Toate câmpurile obligatorii trebuie completate." });
    }

    const clinic = await findClinicByUserId(req.user.id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinica nu a fost găsită." });
    }

    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, 'doctor')`,
      [firstName, lastName, email, hashedPassword]
    );
    const newUserId = userResult.insertId;

    const [doctorResult] = await connection.query(
      `INSERT INTO doctors (user_id, clinic_id, first_name, last_name, experience_years, description) VALUES (?, ?, ?, ?, ?, ?)`,
      [newUserId, clinic.id, firstName, lastName, experienceYears || 0, description || ""]
    );
    const newDoctorId = doctorResult.insertId;

    if (specialtyIds && specialtyIds.length > 0) {
      const specValues = specialtyIds.map(specId => [newDoctorId, specId]);
      await connection.query(
        `INSERT INTO doctor_specialties (doctor_id, specialty_id) VALUES ?`,
        [specValues]
      );
    }

    if (workingHours && workingHours.length > 0) {
      const hoursValues = workingHours.map(wh => [newDoctorId, wh.weekday, wh.startTime, wh.endTime]);
      await connection.query(
        `INSERT INTO doctor_working_hours (doctor_id, weekday, start_time, end_time) VALUES ?`,
        [hoursValues]
      );
    }

    await connection.commit();
    return res.status(201).json({ message: "Doctor profile created successfully." });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error in createDoctorForOwnClinic:", error.message);

    return res.status(500).json({
      message: "Failed to create doctor.",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};
module.exports = {
  getMyClinic,
  getPatientFilesForClinic,
  createDoctorForOwnClinic,
};