const express = require("express");
const router = express.Router();

const { getMyProfile, updateMyProfile } = require("../controllers/profileController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

module.exports = router;