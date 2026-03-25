const express = require("express");
const router = express.Router();

const {
  getMyClinicReview,
  createClinicReview,
  editReview,
  removeReview,
} = require("../controllers/reviewController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.use(authenticateToken, authorizeRoles("patient"));

router.get("/clinic/:clinicId/my", getMyClinicReview);
router.post("/clinic/:clinicId", createClinicReview);
router.put("/:reviewId", editReview);
router.delete("/:reviewId", removeReview);

module.exports = router;