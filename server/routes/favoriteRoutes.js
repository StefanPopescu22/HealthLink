const express = require("express");
const router = express.Router();

const {
  getMyFavorites,
  saveFavoriteClinic,
  deleteFavoriteClinic,
} = require("../controllers/favoriteController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.use(authenticateToken, authorizeRoles("patient"));

router.get("/my", getMyFavorites);
router.post("/:clinicId", saveFavoriteClinic);
router.delete("/:clinicId", deleteFavoriteClinic);

module.exports = router;