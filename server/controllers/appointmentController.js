const {
  createAppointment,
  getAppointmentsByPatient,
  getAppointmentById,
  cancelAppointment,
} = require("../models/appointmentModel");

const createPatientAppointment = async (req, res) => {
  try {
    const { clinicId, doctorId, appointmentDate, appointmentTime, notes } = req.body;

    if (!clinicId || !doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        message: "Clinic, doctor, date and time are required.",
      });
    }

    const appointmentId = await createAppointment({
      patientUserId: req.user.id,
      clinicId: Number(clinicId),
      doctorId: Number(doctorId),
      appointmentDate,
      appointmentTime,
      notes,
    });

    return res.status(201).json({
      message: "Appointment created successfully.",
      appointmentId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create appointment.",
      error: error.message,
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await getAppointmentsByPatient(req.user.id);
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load appointments.",
      error: error.message,
    });
  }
};

const cancelMyAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.id);
    const appointment = await getAppointmentById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    if (appointment.patient_user_id !== req.user.id) {
      return res.status(403).json({
        message: "You cannot cancel this appointment.",
      });
    }

    await cancelAppointment(appointmentId);

    return res.status(200).json({
      message: "Appointment cancelled successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to cancel appointment.",
      error: error.message,
    });
  }
};

module.exports = {
  createPatientAppointment,
  getMyAppointments,
  cancelMyAppointment,
};