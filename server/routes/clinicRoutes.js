const express = require("express");
const router = express.Router();

const {
  getMyClinic,
  createDoctorForOwnClinic,
} = require("../controllers/clinicController");
const { getClinicDashboard } = require("../controllers/dashboardController");
const {
  getClinicDoctors,
  editClinicDoctor,
} = require("../controllers/clinicManageDoctorsController");
const {
  getMyClinicAppointments,
  changeClinicAppointmentStatus,
} = require("../controllers/clinicAppointmentsController");
const {
  getMyClinicServices,
  createClinicService,
  editClinicService,
  removeClinicService,
} = require("../controllers/clinicServicesController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.use(authenticateToken, authorizeRoles("clinic"));

router.get("/me", getMyClinic);
router.get("/dashboard", getClinicDashboard);

router.get("/appointments", getMyClinicAppointments);
router.patch("/appointments/:appointmentId/status", changeClinicAppointmentStatus);

router.get("/doctors", getClinicDoctors);
router.put("/doctors/:doctorId", editClinicDoctor);
router.post("/doctors", createDoctorForOwnClinic);

router.get("/services", getMyClinicServices);
router.post("/services", createClinicService);
router.put("/services/:clinicServiceId", editClinicService);
router.delete("/services/:clinicServiceId", removeClinicService);

module.exports = router;