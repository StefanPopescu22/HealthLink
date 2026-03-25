const {
  listPublicClinics,
  getPublicClinicById,
  getClinicDoctors,
  getClinicReviews,
  listPublicDoctors,
  getPublicDoctorById,
  listPublicServices,
} = require("../models/publicModel");

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

module.exports = {
  getClinics,
  getClinicById,
  getDoctors,
  getDoctorById,
  getServices,
};