const express = require("express");
const router = express.Router();

const {
  createClinic,
  createDoctorByAdmin,
  getClinicOptions,
} = require("../controllers/adminController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.use(authenticateToken, authorizeRoles("admin"));

router.get("/clinics/options", getClinicOptions);
router.post("/clinics", createClinic);
router.post("/doctors", createDoctorByAdmin);

module.exports = router;