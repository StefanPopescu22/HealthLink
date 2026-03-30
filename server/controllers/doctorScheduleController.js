const {
  getDoctorById,
  getClinicDoctorsOptions,
  getAdminDoctorsOptions,
  getDoctorWorkingHours,
  clinicCanManageDoctor,
  getWorkingHourById,
  hasScheduleOverlap,
  createWorkingHour,
  updateWorkingHour,
  deleteWorkingHour,
} = require("../models/doctorScheduleModel");
const { isPositiveInt, isValidTimeString } = require("../utils/validators");

const isValidWeekday = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 6;
};

const isStartBeforeEnd = (startTime, endTime) => {
  return startTime < endTime;
};

const getClinicDoctorsForSchedule = async (req, res) => {
  try {
    const data = await getClinicDoctorsOptions(req.user.id);

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

const getAdminDoctorsForSchedule = async (req, res) => {
  try {
    const doctors = await getAdminDoctorsOptions();
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load doctors.",
      error: error.message,
    });
  }
};

const getClinicDoctorSchedule = async (req, res) => {
  try {
    const doctorId = Number(req.params.doctorId);

    if (!isPositiveInt(doctorId)) {
      return res.status(400).json({
        message: "Invalid doctor id.",
      });
    }

    const allowed = await clinicCanManageDoctor(req.user.id, doctorId);
    if (!allowed) {
      return res.status(403).json({
        message: "You cannot manage this doctor schedule.",
      });
    }

    const doctor = await getDoctorById(doctorId);
    const schedule = await getDoctorWorkingHours(doctorId);

    return res.status(200).json({
      doctor,
      schedule,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load doctor schedule.",
      error: error.message,
    });
  }
};

const getAdminDoctorSchedule = async (req, res) => {
  try {
    const doctorId = Number(req.params.doctorId);

    if (!isPositiveInt(doctorId)) {
      return res.status(400).json({
        message: "Invalid doctor id.",
      });
    }

    const doctor = await getDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    const schedule = await getDoctorWorkingHours(doctorId);

    return res.status(200).json({
      doctor,
      schedule,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load doctor schedule.",
      error: error.message,
    });
  }
};

const createClinicDoctorSchedule = async (req, res) => {
  try {
    const doctorId = Number(req.params.doctorId);
    const { weekday, startTime, endTime } = req.body;

    if (!isPositiveInt(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor id." });
    }

    if (!isValidWeekday(weekday)) {
      return res.status(400).json({ message: "Invalid weekday." });
    }

    if (!isValidTimeString(startTime) || !isValidTimeString(endTime)) {
      return res.status(400).json({ message: "Invalid time format." });
    }

    if (!isStartBeforeEnd(startTime, endTime)) {
      return res.status(400).json({
        message: "Start time must be earlier than end time.",
      });
    }

    const allowed = await clinicCanManageDoctor(req.user.id, doctorId);
    if (!allowed) {
      return res.status(403).json({
        message: "You cannot manage this doctor schedule.",
      });
    }

    const overlap = await hasScheduleOverlap({
      doctorId,
      weekday: Number(weekday),
      startTime,
      endTime,
    });

    if (overlap) {
      return res.status(409).json({
        message: "This working interval overlaps with an existing one.",
      });
    }

    const scheduleId = await createWorkingHour({
      doctorId,
      weekday: Number(weekday),
      startTime,
      endTime,
    });

    return res.status(201).json({
      message: "Working interval created successfully.",
      scheduleId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create working interval.",
      error: error.message,
    });
  }
};

const createAdminDoctorSchedule = async (req, res) => {
  try {
    const doctorId = Number(req.params.doctorId);
    const { weekday, startTime, endTime } = req.body;

    if (!isPositiveInt(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor id." });
    }

    if (!isValidWeekday(weekday)) {
      return res.status(400).json({ message: "Invalid weekday." });
    }

    if (!isValidTimeString(startTime) || !isValidTimeString(endTime)) {
      return res.status(400).json({ message: "Invalid time format." });
    }

    if (!isStartBeforeEnd(startTime, endTime)) {
      return res.status(400).json({
        message: "Start time must be earlier than end time.",
      });
    }

    const doctor = await getDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    const overlap = await hasScheduleOverlap({
      doctorId,
      weekday: Number(weekday),
      startTime,
      endTime,
    });

    if (overlap) {
      return res.status(409).json({
        message: "This working interval overlaps with an existing one.",
      });
    }

    const scheduleId = await createWorkingHour({
      doctorId,
      weekday: Number(weekday),
      startTime,
      endTime,
    });

    return res.status(201).json({
      message: "Working interval created successfully.",
      scheduleId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create working interval.",
      error: error.message,
    });
  }
};

const updateClinicDoctorSchedule = async (req, res) => {
  try {
    const scheduleId = Number(req.params.scheduleId);
    const { weekday, startTime, endTime } = req.body;

    if (!isPositiveInt(scheduleId)) {
      return res.status(400).json({ message: "Invalid schedule id." });
    }

    if (!isValidWeekday(weekday)) {
      return res.status(400).json({ message: "Invalid weekday." });
    }

    if (!isValidTimeString(startTime) || !isValidTimeString(endTime)) {
      return res.status(400).json({ message: "Invalid time format." });
    }

    if (!isStartBeforeEnd(startTime, endTime)) {
      return res.status(400).json({
        message: "Start time must be earlier than end time.",
      });
    }

    const schedule = await getWorkingHourById(scheduleId);
    if (!schedule) {
      return res.status(404).json({
        message: "Schedule entry not found.",
      });
    }

    const allowed = await clinicCanManageDoctor(req.user.id, schedule.doctor_id);
    if (!allowed) {
      return res.status(403).json({
        message: "You cannot manage this doctor schedule.",
      });
    }

    const overlap = await hasScheduleOverlap({
      doctorId: schedule.doctor_id,
      weekday: Number(weekday),
      startTime,
      endTime,
      excludeScheduleId: scheduleId,
    });

    if (overlap) {
      return res.status(409).json({
        message: "This working interval overlaps with an existing one.",
      });
    }

    await updateWorkingHour({
      scheduleId,
      weekday: Number(weekday),
      startTime,
      endTime,
    });

    return res.status(200).json({
      message: "Working interval updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update working interval.",
      error: error.message,
    });
  }
};

const updateAdminDoctorSchedule = async (req, res) => {
  try {
    const scheduleId = Number(req.params.scheduleId);
    const { weekday, startTime, endTime } = req.body;

    if (!isPositiveInt(scheduleId)) {
      return res.status(400).json({ message: "Invalid schedule id." });
    }

    if (!isValidWeekday(weekday)) {
      return res.status(400).json({ message: "Invalid weekday." });
    }

    if (!isValidTimeString(startTime) || !isValidTimeString(endTime)) {
      return res.status(400).json({ message: "Invalid time format." });
    }

    if (!isStartBeforeEnd(startTime, endTime)) {
      return res.status(400).json({
        message: "Start time must be earlier than end time.",
      });
    }

    const schedule = await getWorkingHourById(scheduleId);
    if (!schedule) {
      return res.status(404).json({
        message: "Schedule entry not found.",
      });
    }

    const overlap = await hasScheduleOverlap({
      doctorId: schedule.doctor_id,
      weekday: Number(weekday),
      startTime,
      endTime,
      excludeScheduleId: scheduleId,
    });

    if (overlap) {
      return res.status(409).json({
        message: "This working interval overlaps with an existing one.",
      });
    }

    await updateWorkingHour({
      scheduleId,
      weekday: Number(weekday),
      startTime,
      endTime,
    });

    return res.status(200).json({
      message: "Working interval updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update working interval.",
      error: error.message,
    });
  }
};

const deleteClinicDoctorSchedule = async (req, res) => {
  try {
    const scheduleId = Number(req.params.scheduleId);

    if (!isPositiveInt(scheduleId)) {
      return res.status(400).json({ message: "Invalid schedule id." });
    }

    const schedule = await getWorkingHourById(scheduleId);
    if (!schedule) {
      return res.status(404).json({
        message: "Schedule entry not found.",
      });
    }

    const allowed = await clinicCanManageDoctor(req.user.id, schedule.doctor_id);
    if (!allowed) {
      return res.status(403).json({
        message: "You cannot manage this doctor schedule.",
      });
    }

    await deleteWorkingHour(scheduleId);

    return res.status(200).json({
      message: "Working interval deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete working interval.",
      error: error.message,
    });
  }
};

const deleteAdminDoctorSchedule = async (req, res) => {
  try {
    const scheduleId = Number(req.params.scheduleId);

    if (!isPositiveInt(scheduleId)) {
      return res.status(400).json({ message: "Invalid schedule id." });
    }

    const schedule = await getWorkingHourById(scheduleId);
    if (!schedule) {
      return res.status(404).json({
        message: "Schedule entry not found.",
      });
    }

    await deleteWorkingHour(scheduleId);

    return res.status(200).json({
      message: "Working interval deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete working interval.",
      error: error.message,
    });
  }
};

module.exports = {
  getClinicDoctorsForSchedule,
  getAdminDoctorsForSchedule,
  getClinicDoctorSchedule,
  getAdminDoctorSchedule,
  createClinicDoctorSchedule,
  createAdminDoctorSchedule,
  updateClinicDoctorSchedule,
  updateAdminDoctorSchedule,
  deleteClinicDoctorSchedule,
  deleteAdminDoctorSchedule,
};