const {
  getAllUsersForAdmin,
  setUserBlockedState,
  getUserById,
  deleteUserById,
} = require("../models/adminUsersModel");

const getAdminUsers = async (req, res) => {
  try {
    const users = await getAllUsersForAdmin();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load users.",
      error: error.message,
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await setUserBlockedState(userId, true);

    return res.status(200).json({
      message: "User blocked successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to block user.",
      error: error.message,
    });
  }
};

const unblockUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await setUserBlockedState(userId, false);

    return res.status(200).json({
      message: "User unblocked successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to unblock user.",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    
    // 1. Verificăm mai întâi dacă userul există
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await deleteUserById(userId);

    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete user.",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminUsers,
  blockUser,
  unblockUser,
  deleteUser,
};