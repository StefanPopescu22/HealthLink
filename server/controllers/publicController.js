const {
  listPublicClinics,
  getPublicClinicById,
  getClinicDoctors,
  getClinicReviews,
  listPublicDoctors,
  getPublicDoctorById,
  listPublicServices,
  listPublicSpecialties,
  getDoctorWorkingHoursByDate,
} = require("../models/publicModel");
const {
  getDoctorForAppointment,
  getClinicServiceForAppointment,
  getDoctorAppointmentsForDate,
} = require("../models/appointmentModel");

const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTimeString = (minutes) => {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
};

const getClinics = async (req, res) => {
  try {
    const clinics = await listPublicClinics(req.query);
    return res.status(200).json(clinics);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load clinics.",
      error: error.message,
    });
  }
};

const getClinicById = async (req, res) => {
  try {
    const clinicId = Number(req.params.id);
    const clinic = await getPublicClinicById(clinicId);

    if (!clinic) {
      return res.status(404).json({
        message: "Clinic not found.",
      });
    }

    const doctors = await getClinicDoctors(clinicId);
    const reviews = await getClinicReviews(clinicId);

    return res.status(200).json({
      clinic,
      doctors,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load clinic details.",
      error: error.message,
    });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await listPublicDoctors(req.query);
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load doctors.",
      error: error.message,
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctorId = Number(req.params.id);
    const doctor = await getPublicDoctorById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load doctor details.",
      error: error.message,
    });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await listPublicServices(req.query);
    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load services.",
      error: error.message,
    });
  }
};

const getSpecialties = async (req, res) => {
  try {
    const specialties = await listPublicSpecialties();
    return res.status(200).json(specialties);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load specialties.",
      error: error.message,
    });
  }
};

const getDoctorWorkingHours = async (req, res) => {
  try {
    const doctorId = Number(req.params.id);
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Date is required.",
      });
    }

    const intervals = await getDoctorWorkingHoursByDate(doctorId, date);
    return res.status(200).json(intervals);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load doctor working hours.",
      error: error.message,
    });
  }
};

const getDoctorAvailableSlots = async (req, res) => {
  try {
    const doctorId = Number(req.params.id);
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      return res.status(400).json({
        message: "Date and serviceId are required.",
      });
    }

    const doctor = await getDoctorForAppointment(doctorId);
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    const clinicService = await getClinicServiceForAppointment(doctor.clinic_id, Number(serviceId));
    if (!clinicService) {
      return res.status(400).json({
        message: "The selected service is not available for this doctor's clinic.",
      });
    }

    const duration = Number(clinicService.duration_minutes || 30);
    const workingIntervals = await getDoctorWorkingHoursByDate(doctorId, date);
    const existingAppointments = await getDoctorAppointmentsForDate(doctorId, date);

    const slots = [];
    const step = 15;

    for (const interval of workingIntervals) {
      const start = timeToMinutes(interval.start_time);
      const end = timeToMinutes(interval.end_time);

      for (let current = start; current + duration <= end; current += step) {
        const currentEnd = current + duration;

        const overlaps = existingAppointments.some((appointment) => {
          const existingStart = timeToMinutes(appointment.appointment_time);
          const existingEnd = existingStart + Number(appointment.duration_minutes || 30);

          return current < existingEnd && currentEnd > existingStart;
        });

        if (!overlaps) {
          slots.push(minutesToTimeString(current));
        }
      }
    }

    return res.status(200).json({
      durationMinutes: duration,
      workingIntervals,
      slots,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load available slots.",
      error: error.message,
    });
  }
};

module.exports = {
  getClinics,
  getClinicById,
  getDoctors,
  getDoctorById,
  getServices,
  getSpecialties,
  getDoctorWorkingHours,
  getDoctorAvailableSlots,
};