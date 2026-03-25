const express = require("express");
const router = express.Router();

const {
  getClinics,
  getClinicById,
  getDoctors,
  getDoctorById,
  getServices,
} = require("../controllers/publicController");

router.get("/clinics", getClinics);
router.get("/clinics/:id", getClinicById);
router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctorById);
router.get("/services", getServices);

module.exports = router;