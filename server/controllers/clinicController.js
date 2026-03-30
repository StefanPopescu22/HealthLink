const bcrypt = require("bcrypt");
const db = require("../config/db");
const { createUser, findUserByEmail, findUserById } = require("../models/userModel");
const { findClinicByUserId } = require("../models/clinicModel");
const {
    createDoctorProfile,
    attachDoctorSpecialties,
    insertDoctorWorkingHours,
    buildDoctorScheduleSummary,
  } = require("../models/doctorModel");

  const {
    isValidEmail,
    isValidPassword,
    isNonEmptyString,
    isValidWorkingHoursArray,
  } = require("../utils/validators");
  const normalizeIds = (value) => {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0))];
  };

const getMyClinic = async (req, res) => {
  try {
    const clinic = await findClinicByUserId(req.user.id);

    if (!clinic) {
      return res.status(404).json({
        message: "Clinic profile not found for this account.",
      });
    }

    return res.status(200).json(clinic);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load clinic profile.",
      error: error.message,
    });
  }
};

const createDoctorForOwnClinic = async (req, res) => {
  const db = require("../config/db");
  const bcrypt = require("bcrypt");
  const { findUserByEmail, createUser, findUserById } = require("../models/userModel");
  const { findClinicByUserId } = require("../models/clinicModel");

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      specialtyIds,
      experienceYears,
      description,
      workingHours,
    } = req.body;

    if (!isNonEmptyString(firstName, 2) || !isNonEmptyString(lastName, 2)) {
      return res.status(400).json({
        message: "First name and last name are required.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address.",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Password must have at least 6 characters.",
      });
    }

    if (!Array.isArray(specialtyIds) || specialtyIds.length === 0) {
      return res.status(400).json({
        message: "At least one specialty is required.",
      });
    }

    if (!isValidWorkingHoursArray(workingHours)) {
      return res.status(400).json({
        message: "A valid structured working schedule is required.",
      });
    }

    const clinic = await findClinicByUserId(req.user.id);
    if (!clinic) {
      return res.status(404).json({
        message: "Clinic profile not found.",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists.",
      });
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const passwordHash = await bcrypt.hash(password, 10);

      const userId = await createUser(
        {
          firstName,
          lastName,
          email,
          passwordHash,
          role: "doctor",
        },
        connection
      );

      const scheduleInfo = buildDoctorScheduleSummary(workingHours);

      const doctorId = await createDoctorProfile(connection, {
        userId,
        clinicId: clinic.id,
        firstName,
        lastName,
        description,
        experienceYears,
        scheduleInfo,
      });

      await attachDoctorSpecialties(connection, doctorId, specialtyIds);
      await insertDoctorWorkingHours(connection, doctorId, workingHours);

      await connection.commit();

      const createdUser = await findUserById(userId);

      return res.status(201).json({
        message: "Doctor created successfully.",
        doctorId,
        user: createdUser,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create doctor.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyClinic,
  createDoctorForOwnClinic,
};