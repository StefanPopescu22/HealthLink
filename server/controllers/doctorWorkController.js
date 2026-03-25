const {
  getDoctorPatients,
  getDoctorPatientDetails,
  createDoctorNote,
} = require("../models/doctorWorkModel");

const getMyPatients = async (req, res) => {
  try {
    const data = await getDoctorPatients(req.user.id);

    if (!data) {
      return res.status(404).json({
        message: "Doctor profile not found.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load doctor patients.",
      error: error.message,
    });
  }
};

const getPatientDetails = async (req, res) => {
  try {
    const patientUserId = Number(req.params.patientUserId);
    const data = await getDoctorPatientDetails(req.user.id, patientUserId);

    if (!data) {
      return res.status(404).json({
        message: "Patient not found.",
      });
    }

    if (data.forbidden) {
      return res.status(403).json({
        message: "You do not have access to this patient.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load patient details.",
      error: error.message,
    });
  }
};

const addPatientNote = async (req, res) => {
  try {
    const patientUserId = Number(req.params.patientUserId);
    const { appointmentId, noteText, recommendationText } = req.body;

    if (!noteText) {
      return res.status(400).json({
        message: "Medical note text is required.",
      });
    }

    const result = await createDoctorNote({
      doctorUserId: req.user.id,
      patientUserId,
      appointmentId,
      noteText,
      recommendationText,
    });

    if (result.doctorNotFound) {
      return res.status(404).json({
        message: "Doctor profile not found.",
      });
    }

    if (result.forbidden) {
      return res.status(403).json({
        message: "You do not have access to this patient.",
      });
    }

    return res.status(201).json({
      message: "Medical note added successfully.",
      noteId: result.noteId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add medical note.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyPatients,
  getPatientDetails,
  addPatientNote,
};