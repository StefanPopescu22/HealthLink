const { listSpecialties } = require("../models/specialtyModel");

const getSpecialties = async (req, res) => {
  try {
    const specialties = await listSpecialties();
    return res.status(200).json(specialties);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load specialties.",
      error: error.message,
    });
  }
};

module.exports = {
  getSpecialties,
};