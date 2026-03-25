const {
  createAppointment,
  getAppointmentsByPatient,
  getAppointmentById,
  cancelAppointment,
  getClinicForAppointment,
  getDoctorForAppointment,
  hasDoctorSlotConflict,
  hasPatientDuplicateAppointment,
} = require("../models/appointmentModel");
const {
  isPositiveInt,
  isValidDateString,
  isValidTimeString,
  isTodayOrFutureDate,
  normalizeText,
} = require("../utils/validators");

const createPatientAppointment = async (req, res) => {
  try {
    const { clinicId, doctorId, appointmentDate, appointmentTime, notes } = req.body;

    if (!isPositiveInt(clinicId) || !isPositiveInt(doctorId)) {
      return res.status(400).json({
        message: "Clinic and doctor are required.",
      });
    }

    if (!isValidDateString(appointmentDate) || !isTodayOrFutureDate(appointmentDate)) {
      return res.status(400).json({
        message: "Appointment date must be today or in the future.",
      });
    }

    if (!isValidTimeString(appointmentTime)) {
      return res.status(400).json({
        message: "Invalid appointment time.",
      });
    }

    const clinic = await getClinicForAppointment(Number(clinicId));
    if (!clinic || !clinic.approved) {
      return res.status(404).json({
        message: "Clinic not found.",
      });
    }

    const doctor = await getDoctorForAppointment(Number(doctorId));
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    if (Number(doctor.clinic_id) !== Number(clinicId)) {
      return res.status(400).json({
        message: "Selected doctor does not belong to the selected clinic.",
      });
    }

    const doctorConflict = await hasDoctorSlotConflict({
      doctorId: Number(doctorId),
      appointmentDate,
      appointmentTime,
    });

    if (doctorConflict) {
      return res.status(409).json({
        message: "This doctor already has an appointment at the selected time.",
      });
    }

    const duplicateAppointment = await hasPatientDuplicateAppointment({
      patientUserId: req.user.id,
      doctorId: Number(doctorId),
      appointmentDate,
      appointmentTime,
    });

    if (duplicateAppointment) {
      return res.status(409).json({
        message: "You already have this appointment booked.",
      });
    }

    const appointmentId = await createAppointment({
      patientUserId: req.user.id,
      clinicId: Number(clinicId),
      doctorId: Number(doctorId),
      appointmentDate,
      appointmentTime,
      notes: normalizeText(notes),
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

    if (appointment.status === "cancelled" || appointment.status === "completed") {
      return res.status(400).json({
        message: "This appointment can no longer be cancelled.",
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