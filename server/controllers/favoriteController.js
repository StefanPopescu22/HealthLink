const {
  getFavoriteByUserAndClinic,
  addFavorite,
  removeFavorite,
  getFavoriteClinicsByUser,
} = require("../models/favoriteModel");
const { clinicExists } = require("../models/clinicModel");
const { isPositiveInt } = require("../utils/validators");

const getMyFavorites = async (req, res) => {
  try {
    const favorites = await getFavoriteClinicsByUser(req.user.id);

    return res.status(200).json(favorites);
  } catch (error) {
    console.error("Favorites load error:", error);
    return res.status(500).json({
      message: "Failed to load favorites.",
      error: error.message,
    });
  }
};

const saveFavoriteClinic = async (req, res) => {
  try {
    const clinicId = Number(req.params.clinicId);

    if (!isPositiveInt(clinicId)) {
      return res.status(400).json({
        message: "Invalid clinic id.",
      });
    }

    const clinic = await clinicExists(clinicId);
    if (!clinic) {
      return res.status(404).json({
        message: "Clinic not found.",
      });
    }

    const existing = await getFavoriteByUserAndClinic(req.user.id, clinicId);

    if (existing) {
      return res.status(409).json({
        message: "Clinic is already in favorites.",
      });
    }

    await addFavorite(req.user.id, clinicId);

    return res.status(201).json({
      message: "Clinic added to favorites.",
    });
  } catch (error) {
    console.error("Favorite add error:", error);
    return res.status(500).json({
      message: "Failed to add favorite.",
      error: error.message,
    });
  }
};

const deleteFavoriteClinic = async (req, res) => {
  try {
    const clinicId = Number(req.params.clinicId);

    if (!isPositiveInt(clinicId)) {
      return res.status(400).json({
        message: "Invalid clinic id.",
      });
    }

    await removeFavorite(req.user.id, clinicId);

    return res.status(200).json({
      message: "Clinic removed from favorites.",
    });
  } catch (error) {
    console.error("Favorite delete error:", error);
    return res.status(500).json({
      message: "Failed to remove favorite.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyFavorites,
  saveFavoriteClinic,
  deleteFavoriteClinic,
};