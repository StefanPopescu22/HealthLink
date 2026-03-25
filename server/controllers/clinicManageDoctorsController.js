const {
  getClinicDoctorsList,
  updateClinicDoctor,
} = require("../models/clinicManageDoctorsModel");

const getClinicDoctors = async (req, res) => {
  try {
    const data = await getClinicDoctorsList(req.user.id);

    if (!data) {
      return res.status(404).json({
        message: "Clinic profile not found.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load clinic doctors.",
      error: error.message,
    });
  }
};

const editClinicDoctor = async (req, res) => {
  try {
    const doctorId = Number(req.params.doctorId);
    const result = await updateClinicDoctor(req.user.id, doctorId, req.body);

    if (result.clinicNotFound) {
      return res.status(404).json({
        message: "Clinic profile not found.",
      });
    }

    if (result.doctorNotFound) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    if (result.forbidden) {
      return res.status(403).json({
        message: "You cannot manage this doctor.",
      });
    }

    return res.status(200).json({
      message: "Doctor updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update doctor.",
      error: error.message,
    });
  }
};

module.exports = {
  getClinicDoctors,
  editClinicDoctor,
};