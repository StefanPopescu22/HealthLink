const { getClinicPatientFiles } = require("../models/clinicPatientFilesModel");

const getClinicPatientFilesController = async (req, res) => {
  try {
    const patientUserId = Number(req.params.patientUserId);
    const data = await getClinicPatientFiles(req.user.id, patientUserId);

    if (!data) {
      return res.status(404).json({
        message: "Patient or clinic not found.",
      });
    }

    if (data.forbidden) {
      return res.status(403).json({
        message: "You do not have access to this patient files.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load patient files.",
      error: error.message,
    });
  }
};

module.exports = {
  getClinicPatientFilesController,
};