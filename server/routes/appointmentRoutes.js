const express = require("express");
const router = express.Router();

const {
  createPatientAppointment,
  getMyAppointments,
  cancelMyAppointment,
} = require("../controllers/appointmentController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.use(authenticateToken, authorizeRoles("patient"));

router.get("/my", getMyAppointments);
router.post("/", createPatientAppointment);
router.patch("/:id/cancel", cancelMyAppointment);

module.exports = router;