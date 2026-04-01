const {
  createMedicalDocument,
  getDocumentsByPatient,
  getDocumentById,
  updateMedicalDocument,
  deleteMedicalDocument,
} = require("../models/documentModel");
const {
  getDoctorForAppointment,
  getClinicForAppointment,
} = require("../models/appointmentModel");
const {
  doctorHasPatientRelation,
  clinicHasPatientRelation,
} = require("../models/patientFilesAccessModel");
const {
  isPositiveInt,
  isNonEmptyString,
} = require("../utils/validators");

const uploadMedicalDocumentForPatient = async (req, res) => {
  try {
    const { patientUserId, clinicId, doctorId, appointmentId, title, category } = req.body;

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
        message: "Document title is required.",
      });
    }

    let resolvedClinicId = null;
    let resolvedDoctorId = null;

    if (req.user.role === "patient") {
      if (Number(patientUserId) !== req.user.id) {
        return res.status(403).json({
          message: "You can only upload documents for your own account.",
        });
      }
    }

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

    if (req.user.role === "patient") {
      resolvedClinicId = clinicId ? Number(clinicId) : null;
      resolvedDoctorId = doctorId ? Number(doctorId) : null;
    }

    if (resolvedClinicId) {
      const clinic = await getClinicForAppointment(resolvedClinicId);
      if (!clinic) {
        return res.status(404).json({
          message: "Clinic not found.",
        });
      }
    }

    if (resolvedDoctorId) {
      const doctor = await getDoctorForAppointment(resolvedDoctorId);
      if (!doctor) {
        return res.status(404).json({
          message: "Doctor not found.",
        });
      }
    }

    const documentId = await createMedicalDocument({
      patientUserId: Number(patientUserId),
      clinicId: resolvedClinicId,
      doctorId: resolvedDoctorId,
      appointmentId: appointmentId ? Number(appointmentId) : null,
      title,
      category,
      fileName: req.file.filename,
      filePath: `/uploads/documents/${req.file.filename}`,
      createdByUserId: req.user.id,
    });

    return res.status(201).json({
      message: "Medical document uploaded successfully.",
      documentId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to upload medical document.",
      error: error.message,
    });
  }
};

const getMyDocuments = async (req, res) => {
  try {
    const documents = await getDocumentsByPatient(req.user.id);
    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load medical documents.",
      error: error.message,
    });
  }
};

const updatePatientDocument = async (req, res) => {
  try {
    const documentId = Number(req.params.documentId);
    const { title, category } = req.body;

    const document = await getDocumentById(documentId);
    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    let allowed = false;

    if (req.user.role === "doctor") {
      const relation = await doctorHasPatientRelation(req.user.id, document.user_id);
      allowed = relation.allowed;
    }

    if (req.user.role === "clinic") {
      const relation = await clinicHasPatientRelation(req.user.id, document.user_id);
      allowed = relation.allowed;
    }

    if (!allowed) {
      return res.status(403).json({
        message: "You cannot modify this document.",
      });
    }

    await updateMedicalDocument({
      documentId,
      title,
      category,
      fileName: req.file?.filename || null,
      filePath: req.file ? `/uploads/documents/${req.file.filename}` : null,
      clinicId: document.clinic_id,
      doctorId: document.doctor_id,
      appointmentId: document.appointment_id,
    });

    return res.status(200).json({
      message: "Medical document updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update medical document.",
      error: error.message,
    });
  }
};

const removeMyDocument = async (req, res) => {
  try {
    const documentId = Number(req.params.id);
    const document = await getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    if (document.user_id !== req.user.id && document.created_by_user_id !== req.user.id) {
      return res.status(403).json({
        message: "You cannot delete this document.",
      });
    }

    await deleteMedicalDocument(documentId);

    return res.status(200).json({
      message: "Medical document deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete document.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadMedicalDocumentForPatient,
  getMyDocuments,
  updatePatientDocument,
  removeMyDocument,
};