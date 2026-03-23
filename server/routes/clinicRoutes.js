const express = require("express");
const router = express.Router();

const {
  getMyClinic,
  createDoctorForOwnClinic,
} = require("../controllers/clinicController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.use(authenticateToken, authorizeRoles("clinic"));

router.get("/me", getMyClinic);
router.post("/doctors", createDoctorForOwnClinic);

module.exports = router;