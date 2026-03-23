const bcrypt = require("bcrypt");
const db = require("../config/db");
const { createUser, findUserByEmail, findUserById } = require("../models/userModel");
const {
  createClinicProfile,
  clinicExists,
  listClinicOptions,
} = require("../models/clinicModel");
const { createDoctorProfile, attachDoctorSpecialties } = require("../models/doctorModel");

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
  const connection = await db.getConnection();

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      clinicId,
      specialtyIds,
      description,
      experienceYears,
      scheduleInfo,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !clinicId) {
      return res.status(400).json({
        message: "Missing required fields for doctor creation.",
      });
    }

    const normalizedSpecialtyIds = normalizeIds(specialtyIds);
    if (normalizedSpecialtyIds.length === 0) {
      return res.status(400).json({
        message: "Please select at least one specialty.",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists.",
      });
    }

    const clinic = await clinicExists(clinicId);
    if (!clinic) {
      return res.status(404).json({
        message: "Clinic not found.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

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

    const doctorId = await createDoctorProfile(
      {
        userId,
        clinicId: Number(clinicId),
        firstName,
        lastName,
        description: description || null,
        experienceYears: Number(experienceYears) || 0,
        scheduleInfo: scheduleInfo || null,
      },
      connection
    );

    await attachDoctorSpecialties(doctorId, normalizedSpecialtyIds, connection);

    await connection.commit();

    const user = await findUserById(userId);

    return res.status(201).json({
      message: "Doctor created successfully by admin.",
      doctor: {
        id: doctorId,
        clinicId: Number(clinicId),
      },
      user,
    });
  } catch (error) {
    await connection.rollback();

    return res.status(500).json({
      message: "Doctor creation failed.",
      error: error.message,
    });
  } finally {
    connection.release();
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