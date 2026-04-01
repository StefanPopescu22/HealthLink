const {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getAllSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} = require("../models/adminCatalogModel");
const { isNonEmptyString, isPositiveInt } = require("../utils/validators");

const getAdminServices = async (req, res) => {
  try {
    const services = await getAllServices();
    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load services.",
      error: error.message,
    });
  }
};

const createAdminService = async (req, res) => {
  try {
    const { name, specialtyId, category, description, durationMinutes } = req.body;

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

    const serviceId = await createService({
      name,
      specialtyId: Number(specialtyId),
      category,
      description,
      durationMinutes,
    });

    return res.status(201).json({
      message: "Service created successfully.",
      serviceId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create service.",
      error: error.message,
    });
  }
};

const editAdminService = async (req, res) => {
  try {
    const serviceId = Number(req.params.serviceId);
    await updateService(serviceId, req.body);

    return res.status(200).json({
      message: "Service updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update service.",
      error: error.message,
    });
  }
};

const removeAdminService = async (req, res) => {
  try {
    const serviceId = Number(req.params.serviceId);
    await deleteService(serviceId);

    return res.status(200).json({
      message: "Service deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete service.",
      error: error.message,
    });
  }
};

const getAdminSpecialties = async (req, res) => {
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

const createAdminSpecialty = async (req, res) => {
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

const editAdminSpecialty = async (req, res) => {
  try {
    const specialtyId = Number(req.params.specialtyId);
    await updateSpecialty(specialtyId, req.body);

    return res.status(200).json({
      message: "Specialty updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update specialty.",
      error: error.message,
    });
  }
};

const removeAdminSpecialty = async (req, res) => {
  try {
    const specialtyId = Number(req.params.specialtyId);
    await deleteSpecialty(specialtyId);

    return res.status(200).json({
      message: "Specialty deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete specialty.",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminServices,
  createAdminService,
  editAdminService,
  removeAdminService,
  getAdminSpecialties,
  createAdminSpecialty,
  editAdminSpecialty,
  removeAdminSpecialty,
};