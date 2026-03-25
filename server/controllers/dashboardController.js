const {
  getDoctorDashboardData,
  getClinicDashboardData,
  getAdminDashboardData,
} = require("../models/dashboardModel");

const getDoctorDashboard = async (req, res) => {
  try {
    const data = await getDoctorDashboardData(req.user.id);

    if (!data) {
      return res.status(404).json({
        message: "Doctor dashboard data not found.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load doctor dashboard.",
      error: error.message,
    });
  }
};

const getClinicDashboard = async (req, res) => {
  try {
    const data = await getClinicDashboardData(req.user.id);

    if (!data) {
      return res.status(404).json({
        message: "Clinic dashboard data not found.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load clinic dashboard.",
      error: error.message,
    });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const data = await getAdminDashboardData();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load admin dashboard.",
      error: error.message,
    });
  }
};

module.exports = {
  getDoctorDashboard,
  getClinicDashboard,
  getAdminDashboard,
};