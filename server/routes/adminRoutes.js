const express = require("express");
const router = express.Router();

const {
  createClinic,
  createDoctorByAdmin,
  getClinicOptions,
} = require("../controllers/adminController");
const { getAdminDashboard } = require("../controllers/dashboardController");
const {
  getAdminUsers,
  blockUser,
  unblockUser,
} = require("../controllers/adminUsersController");
const {
  getAdminServices,
  createAdminService,
  editAdminService,
  removeAdminService,
  getAdminSpecialties,
  createAdminSpecialty,
  editAdminSpecialty,
  removeAdminSpecialty,
} = require("../controllers/adminCatalogController");
const {
  getAdminDoctorsForSchedule,
  getAdminDoctorSchedule,
  createAdminDoctorSchedule,
  updateAdminDoctorSchedule,
  deleteAdminDoctorSchedule,
} = require("../controllers/doctorScheduleController");
const {
  getAdminDoctors,
  editAdminDoctor,
} = require("../controllers/adminDoctorsController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.use(authenticateToken, authorizeRoles("admin"));

router.get("/dashboard", getAdminDashboard);

router.get("/users", getAdminUsers);
router.patch("/users/:userId/block", blockUser);
router.patch("/users/:userId/unblock", unblockUser);

router.get("/clinics/options", getClinicOptions);
router.post("/clinics", createClinic);

router.get("/doctors", getAdminDoctors);
router.put("/doctors/:doctorId", editAdminDoctor);
router.post("/doctors", createDoctorByAdmin);

router.get("/services", getAdminServices);
router.post("/services", createAdminService);
router.put("/services/:serviceId", editAdminService);
router.delete("/services/:serviceId", removeAdminService);

router.get("/specialties", getAdminSpecialties);
router.post("/specialties", createAdminSpecialty);
router.put("/specialties/:specialtyId", editAdminSpecialty);
router.delete("/specialties/:specialtyId", removeAdminSpecialty);

router.get("/doctor-schedules/doctors", getAdminDoctorsForSchedule);
router.get("/doctor-schedules/:doctorId", getAdminDoctorSchedule);
router.post("/doctor-schedules/:doctorId", createAdminDoctorSchedule);
router.put("/doctor-schedules/:scheduleId", updateAdminDoctorSchedule);
router.delete("/doctor-schedules/:scheduleId", deleteAdminDoctorSchedule);

module.exports = router;