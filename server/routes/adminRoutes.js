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
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.use(authenticateToken, authorizeRoles("admin"));

router.get("/dashboard", getAdminDashboard);

router.get("/users", getAdminUsers);
router.patch("/users/:userId/block", blockUser);
router.patch("/users/:userId/unblock", unblockUser);

router.get("/clinics/options", getClinicOptions);
router.post("/clinics", createClinic);
router.post("/doctors", createDoctorByAdmin);

router.get("/services", getAdminServices);
router.post("/services", createAdminService);
router.put("/services/:serviceId", editAdminService);
router.delete("/services/:serviceId", removeAdminService);

router.get("/specialties", getAdminSpecialties);
router.post("/specialties", createAdminSpecialty);
router.put("/specialties/:specialtyId", editAdminSpecialty);
router.delete("/specialties/:specialtyId", removeAdminSpecialty);

module.exports = router;