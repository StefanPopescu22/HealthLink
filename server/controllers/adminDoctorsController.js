const {
  getAllDoctorsForAdmin,
  updateDoctorByAdmin,
} = require("../models/adminDoctorsModel");

const getAdminDoctors = async (req, res) => {
  try {
    const doctors = await getAllDoctorsForAdmin();
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load doctors.",
      error: error.message,
    });
  }
};

const editAdminDoctor = async (req, res) => {
  try {
    const doctorId = Number(req.params.doctorId);
    const result = await updateDoctorByAdmin(doctorId, req.body);

    if (result.notFound) {
      return res.status(404).json({
        message: "Doctor not found.",
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
  getAdminDoctors,
  editAdminDoctor,
};