const bcrypt = require("bcrypt");
const db = require("../config/db");
const { createUser, findUserByEmail, findUserById } = require("../models/userModel");
const { findClinicByUserId } = require("../models/clinicModel");
const { createDoctorProfile, attachDoctorSpecialties } = require("../models/doctorModel");

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
  const connection = await db.getConnection();

  try {
    const clinic = await findClinicByUserId(req.user.id);

    if (!clinic) {
      return res.status(404).json({
        message: "Clinic profile not found for this account.",
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      specialtyIds,
      description,
      experienceYears,
      scheduleInfo,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
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
        clinicId: clinic.id,
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
      message: "Doctor created successfully for your clinic.",
      doctor: {
        id: doctorId,
        clinicId: clinic.id,
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

module.exports = {
  getMyClinic,
  createDoctorForOwnClinic,
};