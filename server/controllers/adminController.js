const bcrypt = require("bcrypt");
const db = require("../config/db");
const { createUser, findUserByEmail, findUserById } = require("../models/userModel");
const {
  createClinicProfile,
  clinicExists,
  listClinicOptions,
} = require("../models/clinicModel");
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
  isPositiveInt,
  isValidWorkingHoursArray,
} = require("../utils/validators");
const normalizeIds = (value) => {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0))];
};

const createClinic = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      contactFirstName,
      contactLastName,
      email,
      password,
      clinicName,
      clinicType,
      city,
      address,
      phone,
      description,
    } = req.body;

    if (
      !contactFirstName ||
      !contactLastName ||
      !email ||
      !password ||
      !clinicName ||
      !clinicType
    ) {
      return res.status(400).json({
        message: "Missing required fields for clinic creation.",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    const userId = await createUser(
      {
        firstName: contactFirstName,
        lastName: contactLastName,
        email,
        passwordHash,
        role: "clinic",
      },
      connection
    );

    const clinicId = await createClinicProfile(
      {
        userId,
        clinicName,
        clinicType,
        city: city || null,
        address: address || null,
        phone: phone || null,
        email,
        description: description || null,
        approved: true,
      },
      connection
    );

    await connection.commit();

    const user = await findUserById(userId);

    return res.status(201).json({
      message: "Clinic account created successfully.",
      clinic: {
        id: clinicId,
        name: clinicName,
      },
      user,
    });
  } catch (error) {
    await connection.rollback();

    return res.status(500).json({
      message: "Clinic creation failed.",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

const createDoctorByAdmin = async (req, res) => {
  const db = require("../config/db");
  const bcrypt = require("bcrypt");
  const { findUserByEmail, createUser, findUserById } = require("../models/userModel");
  const { clinicExists } = require("../models/clinicModel");

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      clinicId,
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

    if (!isPositiveInt(clinicId)) {
      return res.status(400).json({
        message: "A valid clinic is required.",
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

    const clinic = await clinicExists(Number(clinicId));
    if (!clinic) {
      return res.status(404).json({
        message: "Clinic not found.",
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
        clinicId: Number(clinicId),
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

const getClinicOptions = async (req, res) => {
  try {
    const clinics = await listClinicOptions();
    return res.status(200).json(clinics);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load clinic options.",
      error: error.message,
    });
  }
};

module.exports = {
  createClinic,
  createDoctorByAdmin,
  getClinicOptions,
};