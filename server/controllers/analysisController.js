const {
  createMedicalAnalysis,
  getAnalysesByPatient,
  getAnalysisById,
  updateMedicalAnalysis,
  deleteMedicalAnalysis, 
} = require("../models/analysisModel");

const {
  doctorHasPatientRelation,
  clinicHasPatientRelation,
} = require("../models/patientFilesAccessModel");

const {
  getDoctorForAppointment,
  getClinicForAppointment,
} = require("../models/appointmentModel");

const {
  isPositiveInt,
  isNonEmptyString,
} = require("../utils/validators");

const createMedicalAnalysisForPatient = async (req, res) => {
  try {
    const { patientUserId, doctorId, clinicId, appointmentId, title, analysisType, labName, resultStatus } = req.body;

    if (req.user.role === "patient") {
      return res.status(403).json({
        message: "Patients cannot upload medical analyses.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "A file is required.",
      });
    }

    if (!isPositiveInt(patientUserId)) {
      return res.status(400).json({
        message: "Patient is required.",
      });
    }

    if (!isNonEmptyString(title, 2)) {
      return res.status(400).json({
        message: "Analysis title is required.",
      });
    }

    let resolvedClinicId = null;
    let resolvedDoctorId = null;

    if (req.user.role === "doctor") {
      const relation = await doctorHasPatientRelation(req.user.id, Number(patientUserId));
      if (!relation.allowed) {
        return res.status(403).json({
          message: "You do not have access to this patient.",
        });
      }
      resolvedDoctorId = relation.doctor.id;
      resolvedClinicId = relation.doctor.clinic_id;
    }

    if (req.user.role === "clinic") {
      const relation = await clinicHasPatientRelation(req.user.id, Number(patientUserId));
      if (!relation.allowed) {
        return res.status(403).json({
          message: "You do not have access to this patient.",
        });
      }
      resolvedClinicId = relation.clinic.id;
      resolvedDoctorId = doctorId ? Number(doctorId) : null;
    }

    const analysisId = await createMedicalAnalysis({
      patientUserId: Number(patientUserId),
      clinicId: resolvedClinicId,
      doctorId: resolvedDoctorId,
      appointmentId: appointmentId ? Number(appointmentId) : null,
      title,
      analysisType,
      labName,
      resultStatus,
      fileName: req.file.filename,
      filePath: `/uploads/analyses/${req.file.filename}`,
      createdByUserId: req.user.id,
    });

    return res.status(201).json({
      message: "Medical analysis uploaded successfully.",
      analysisId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to upload analysis.",
      error: error.message,
    });
  }
};

const getMyAnalyses = async (req, res) => {
  try {
    const analyses = await getAnalysesByPatient(req.user.id);
    return res.status(200).json(analyses);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load medical analyses.",
      error: error.message,
    });
  }
};

const updatePatientAnalysis = async (req, res) => {
  try {
    const analysisId = Number(req.params.analysisId);
    const { title, analysisType, labName, resultStatus } = req.body;

    const analysis = await getAnalysisById(analysisId);
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found." });
    }

    let allowed = false;
    if (req.user.role === "doctor") {
      const relation = await doctorHasPatientRelation(req.user.id, analysis.user_id);
      allowed = relation.allowed;
    }
    if (req.user.role === "clinic") {
      const relation = await clinicHasPatientRelation(req.user.id, analysis.user_id);
      allowed = relation.allowed;
    }

    if (!allowed) {
      return res.status(403).json({ message: "You cannot modify this analysis." });
    }

    await updateMedicalAnalysis({
      analysisId,
      title,
      analysisType,
      labName,
      resultStatus,
      fileName: req.file?.filename || null,
      filePath: req.file ? `/uploads/analyses/${req.file.filename}` : null,
      clinicId: analysis.clinic_id,
      doctorId: analysis.doctor_id,
      appointmentId: analysis.appointment_id,
    });

    return res.status(200).json({ message: "Medical analysis updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update analysis.", error: error.message });
  }
};

const removeMyAnalysis = async (req, res) => {
  try {
    const analysisId = Number(req.params.id);
    const analysis = await getAnalysisById(analysisId);

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found." });
    }

    if (req.user.role === "patient" && analysis.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: Not your analysis." });
    }
    await deleteMedicalAnalysis(analysisId);

    return res.status(200).json({ message: "Analysis deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete analysis.",
      error: error.message,
    });
  }
};

module.exports = {
  createMedicalAnalysisForPatient,
  getMyAnalyses,
  updatePatientAnalysis,
  removeMyAnalysis, 
};