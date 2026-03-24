const {
  getProfileByUserId,
  upsertPatientProfile,
  updateDoctorProfile,
  updateClinicProfile,
  updateBaseUser,
} = require("../models/profileModel");

const getMyProfile = async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found.",
      });
    }

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load profile.",
      error: error.message,
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    if (req.user.role === "patient") {
      await upsertPatientProfile(req.user.id, req.body);
    } else if (req.user.role === "doctor") {
      await updateDoctorProfile(req.user.id, req.body);
    } else if (req.user.role === "clinic") {
      await updateClinicProfile(req.user.id, req.body);
    } else {
      await updateBaseUser(req.user.id, req.body.phone);
    }

    const updatedProfile = await getProfileByUserId(req.user.id);

    return res.status(200).json({
      message: "Profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update profile.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};