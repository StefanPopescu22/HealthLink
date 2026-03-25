const {
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
} = require("../models/doctorAppointmentsModel");

const getMyDoctorAppointments = async (req, res) => {
  try {
    const data = await getDoctorAppointments(req.user.id);

    if (!data) {
      return res.status(404).json({
        message: "Doctor profile not found.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load doctor appointments.",
      error: error.message,
    });
  }
};

const changeDoctorAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = Number(req.params.appointmentId);
    const { status } = req.body;

    const allowedStatuses = ["confirmed", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status.",
      });
    }

    const result = await updateDoctorAppointmentStatus(req.user.id, appointmentId, status);

    if (result.notFound) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    return res.status(200).json({
      message: "Appointment status updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update appointment status.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyDoctorAppointments,
  changeDoctorAppointmentStatus,
};