const express = require("express");
const router = express.Router();

const { getClinicPatientFilesController } = require("../controllers/clinicPatientFilesController");
const { getMyClinic, createDoctorForOwnClinic } = require("../controllers/clinicController");
const { getClinicDashboard } = require("../controllers/dashboardController");
const { getClinicDoctors, editClinicDoctor } = require("../controllers/clinicManageDoctorsController");
const { getMyClinicAppointments, changeClinicAppointmentStatus } = require("../controllers/clinicAppointmentsController");
const { 
  getMyClinicServices, 
  createClinicService, 
  editClinicService, 
  removeClinicService 
} = require("../controllers/clinicServicesController");
const {
  getClinicDoctorsForSchedule,
  getClinicDoctorSchedule,
  createClinicDoctorSchedule,
  updateClinicDoctorSchedule,
  deleteClinicDoctorSchedule,
} = require("../controllers/doctorScheduleController");

const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const {
  getClinicSpecialties,
  createClinicSpecialty,
  createClinicServiceCatalogEntry,
} = require("../controllers/clinicCatalogController");


router.use(authenticateToken, authorizeRoles("clinic"));

router.get("/specialties", getClinicSpecialties);
router.post("/specialties", createClinicSpecialty);
router.post("/services/catalog", createClinicServiceCatalogEntry); 

router.get("/me", getMyClinic);
router.get("/dashboard", getClinicDashboard);


router.get("/patients/:patientUserId/files", getClinicPatientFilesController);

router.get("/appointments", getMyClinicAppointments);
router.patch("/appointments/:appointmentId/status", changeClinicAppointmentStatus);

router.get("/doctors", getClinicDoctors);
router.post("/doctors", createDoctorForOwnClinic);
router.put("/doctors/:doctorId", editClinicDoctor);

router.get("/services", getMyClinicServices);
router.post("/services", createClinicService);
router.put("/services/:clinicServiceId", editClinicService);
router.delete("/services/:clinicServiceId", removeClinicService);

router.get("/doctor-schedules/doctors", getClinicDoctorsForSchedule);
router.get("/doctor-schedules/:doctorId", getClinicDoctorSchedule);
router.post("/doctor-schedules/:doctorId", createClinicDoctorSchedule);
router.put("/doctor-schedules/:scheduleId", updateClinicDoctorSchedule);
router.delete("/doctor-schedules/:scheduleId", deleteClinicDoctorSchedule);

module.exports = router;