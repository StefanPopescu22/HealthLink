const express = require("express");
const router = express.Router();

// 1. Importăm controllerele
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

// 2. Importăm Middleware-ul de autentificare
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// --- IMPORTANT: Aplicăm protecția ÎNAINTE de rute ---
// Toate rutele de mai jos vor cere login și rolul de "clinic"
router.use(authenticateToken, authorizeRoles("clinic"));

// 3. Definirea Rutelor

// Profil Clinică & Dashboard
router.get("/me", getMyClinic);
router.get("/dashboard", getClinicDashboard);

// Pacienți & Fișiere (Ruta care dădea eroare 500)
// Acum req.user va fi populat corect de authenticateToken
router.get("/patients/:patientUserId/files", getClinicPatientFilesController);

// Programări Clinica
router.get("/appointments", getMyClinicAppointments);
router.patch("/appointments/:appointmentId/status", changeClinicAppointmentStatus);

// Management Doctori (în cadrul clinicii)
router.get("/doctors", getClinicDoctors);
router.post("/doctors", createDoctorForOwnClinic);
router.put("/doctors/:doctorId", editClinicDoctor);

// Servicii Clinică
router.get("/services", getMyClinicServices);
router.post("/services", createClinicService);
router.put("/services/:clinicServiceId", editClinicService);
router.delete("/services/:clinicServiceId", removeClinicService);

// Orare Doctori
router.get("/doctor-schedules/doctors", getClinicDoctorsForSchedule);
router.get("/doctor-schedules/:doctorId", getClinicDoctorSchedule);
router.post("/doctor-schedules/:doctorId", createClinicDoctorSchedule);
router.put("/doctor-schedules/:scheduleId", updateClinicDoctorSchedule);
router.delete("/doctor-schedules/:scheduleId", deleteClinicDoctorSchedule);

module.exports = router;