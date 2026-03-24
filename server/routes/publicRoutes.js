const express = require("express");
const router = express.Router();

const {
  getClinics,
  getClinicById,
  getDoctors,
  getDoctorById,
} = require("../controllers/publicController");

router.get("/clinics", getClinics);
router.get("/clinics/:id", getClinicById);
router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctorById);

module.exports = router;