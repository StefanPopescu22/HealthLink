const {
  getClinicServices,
  addClinicService,
  updateClinicService,
  deleteClinicService,
  addCatalogService, 
} = require("../models/clinicServicesModel");

const getMyClinicServices = async (req, res) => {
  try {
    const data = await getClinicServices(req.user.id);

    if (!data) {
      return res.status(404).json({
        message: "Clinic profile not found.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load clinic services.",
      error: error.message,
    });
  }
};

const createClinicService = async (req, res) => {
  try {
    const { serviceId, price } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        message: "Service is required.",
      });
    }

    const result = await addClinicService(req.user.id, Number(serviceId), price);

    if (result.clinicNotFound) {
      return res.status(404).json({
        message: "Clinic profile not found.",
      });
    }

    return res.status(201).json({
      message: "Service added to clinic successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add clinic service.",
      error: error.message,
    });
  }
};

const editClinicService = async (req, res) => {
  try {
    const clinicServiceId = Number(req.params.clinicServiceId);
    const { price } = req.body;

    const result = await updateClinicService(req.user.id, clinicServiceId, price);

    if (result.clinicNotFound) {
      return res.status(404).json({
        message: "Clinic profile not found.",
      });
    }

    if (result.notFound) {
      return res.status(404).json({
        message: "Clinic service not found.",
      });
    }

    return res.status(200).json({
      message: "Clinic service updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update clinic service.",
      error: error.message,
    });
  }
};

const removeClinicService = async (req, res) => {
  try {
    const clinicServiceId = Number(req.params.clinicServiceId);
    const result = await deleteClinicService(req.user.id, clinicServiceId);

    if (result.clinicNotFound) {
      return res.status(404).json({
        message: "Clinic profile not found.",
      });
    }

    if (result.notFound) {
      return res.status(404).json({
        message: "Clinic service not found.",
      });
    }

    return res.status(200).json({
      message: "Clinic service removed successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove clinic service.",
      error: error.message,
    });
  }
};

const createCatalogService = async (req, res) => {
  try {
    const { name, specialtyId, description } = req.body;

    if (!name || !specialtyId) {
      return res.status(400).json({
        message: "Service name and specialty ID are required.",
      });
    }

    const result = await addCatalogService({
      name,
      specialtyId: Number(specialtyId),
      description: description || null,
    });

    return res.status(201).json({
      message: "Catalog service created successfully.",
      serviceId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create catalog service.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyClinicServices,
  createClinicService,
  editClinicService,
  removeClinicService,
  createCatalogService, 
};