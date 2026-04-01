const express = require("express");
const router = express.Router();

const {
  getClinics,
  getClinicById,
  getDoctors,
  getDoctorById,
  getServices,
  getSpecialties,
  getDoctorWorkingHours,
  getDoctorAvailableSlots,
} = require("../controllers/publicController");

router.get("/clinics", getClinics);
router.get("/clinics/:id", getClinicById);
router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctorById);
router.get("/doctors/:id/working-hours", getDoctorWorkingHours);
router.get("/doctors/:id/available-slots", getDoctorAvailableSlots);
router.get("/services", getServices);
router.get("/specialties", getSpecialties);

module.exports = router;