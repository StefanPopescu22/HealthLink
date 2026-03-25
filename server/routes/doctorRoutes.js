const express = require("express");
const router = express.Router();

const { getDoctorDashboard } = require("../controllers/dashboardController");
const {
  getMyPatients,
  getPatientDetails,
  addPatientNote,
} = require("../controllers/doctorWorkController");
const {
  getMyDoctorAppointments,
  changeDoctorAppointmentStatus,
} = require("../controllers/doctorAppointmentsController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.use(authenticateToken, authorizeRoles("doctor"));

router.get("/dashboard", getDoctorDashboard);
router.get("/appointments", getMyDoctorAppointments);
router.patch("/appointments/:appointmentId/status", changeDoctorAppointmentStatus);
router.get("/patients", getMyPatients);
router.get("/patients/:patientUserId", getPatientDetails);
router.post("/patients/:patientUserId/notes", addPatientNote);

module.exports = router;