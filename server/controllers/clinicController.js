const bcrypt = require("bcrypt");
const db = require("../config/db");
const { findClinicByUserId } = require("../models/clinicModel");
// Importăm funcțiile necesare din modelele de fișiere
const { getDocumentsByPatient } = require("../models/documentModel");
const { getAnalysesByPatient } = require("../models/analysisModel");
const { findUserById } = require("../models/userModel");

const {
  isValidEmail,
  isValidPassword,
  isNonEmptyString,
  isValidWorkingHoursArray,
} = require("../utils/validators");

// --- FUNCTIA NOUA PENTRU FISIERELE PACIENTULUI ---
const getPatientFilesForClinic = async (req, res) => {
  try {
    const patientUserId = Number(req.params.patientUserId);
    
    // 1. Verificăm dacă profilul clinicii există pentru user-ul logat
    const clinic = await findClinicByUserId(req.user.id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic profile not found." });
    }

    // 2. Luăm datele de bază ale pacientului
    const patient = await findUserById(patientUserId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // 3. Luăm documentele și analizele
    // (Folosim funcțiile pe care le-am reparat anterior în modele)
    const documents = await getDocumentsByPatient(patientUserId);
    const analyses = await getAnalysesByPatient(patientUserId);

    // 4. Returnăm datele în formatul așteptat de ClinicPatientFiles.jsx
    return res.status(200).json({
      patient: {
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email
      },
      documents: documents || [],
      analyses: analyses || []
    });

  } catch (error) {
    console.error("Error in getPatientFilesForClinic:", error.message);
    return res.status(500).json({
      message: "Failed to load patient files.",
      error: error.message,
    });
  }
};

const getMyClinic = async (req, res) => {
  try {
    const clinic = await findClinicByUserId(req.user.id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic profile not found." });
    }
    return res.status(200).json(clinic);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load clinic profile.", error: error.message });
  }
};

const createDoctorForOwnClinic = async (req, res) => {
  // ... codul tau existent pentru creare doctor (ramane neschimbat)
};

// ASIGURĂ-TE CĂ EXPORȚI NOUA FUNCȚIE!
module.exports = {
  getMyClinic,
  createDoctorForOwnClinic,
  getPatientFilesForClinic, // <--- ADAUGĂ ASTA
};