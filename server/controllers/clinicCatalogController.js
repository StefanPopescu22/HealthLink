const { getAllSpecialties, createSpecialty } = require("../models/adminCatalogModel");
const { createClinicCatalogService } = require("../models/clinicServicesModel");
const { isNonEmptyString, isPositiveInt } = require("../utils/validators");

const getClinicSpecialties = async (req, res) => {
  try {
    const specialties = await getAllSpecialties();
    return res.status(200).json(specialties);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load specialties.",
      error: error.message,
    });
  }
};

const createClinicSpecialty = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!isNonEmptyString(name, 2)) {
      return res.status(400).json({
        message: "Specialty name is required.",
      });
    }

    const specialtyId = await createSpecialty({ name, description });

    return res.status(201).json({
      message: "Specialty created successfully.",
      specialtyId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create specialty.",
      error: error.message,
    });
  }
};

const createClinicServiceCatalogEntry = async (req, res) => {
  try {
    const { name, specialtyId, category, description, durationMinutes, price } = req.body;

    if (!isNonEmptyString(name, 2)) {
      return res.status(400).json({
        message: "Service name is required.",
      });
    }

    if (!isPositiveInt(specialtyId)) {
      return res.status(400).json({
        message: "A valid specialty is required.",
      });
    }

    const result = await createClinicCatalogService(req.user.id, {
      name,
      specialtyId: Number(specialtyId),
      category,
      description,
      durationMinutes,
      price,
    });

    if (result.clinicNotFound) {
      return res.status(404).json({
        message: "Clinic profile not found.",
      });
    }

    return res.status(201).json({
      message: "Service created and assigned to clinic successfully.",
      serviceId: result.serviceId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create service for clinic.",
      error: error.message,
    });
  }
};

module.exports = {
  getClinicSpecialties,
  createClinicSpecialty,
  createClinicServiceCatalogEntry,
};