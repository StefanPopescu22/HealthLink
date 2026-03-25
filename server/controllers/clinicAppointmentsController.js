const {
  getClinicAppointments,
  updateClinicAppointmentStatus,
} = require("../models/clinicAppointmentsModel");

const getMyClinicAppointments = async (req, res) => {
  try {
    const data = await getClinicAppointments(req.user.id);

    if (!data) {
      return res.status(404).json({
        message: "Clinic profile not found.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load clinic appointments.",
      error: error.message,
    });
  }
};

const changeClinicAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = Number(req.params.appointmentId);
    const { status } = req.body;

    const allowedStatuses = ["confirmed", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status.",
      });
    }

    const result = await updateClinicAppointmentStatus(req.user.id, appointmentId, status);

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
      message: "Failed to update clinic appointment status.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyClinicAppointments,
  changeClinicAppointmentStatus,
};