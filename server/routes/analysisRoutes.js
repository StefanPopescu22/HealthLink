const express = require("express");
const router = express.Router();

const {
  uploadMedicalAnalysis,
  getMyAnalyses,
  deleteMyAnalysis,
} = require("../controllers/analysisController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { analysisUpload } = require("../middleware/uploadMiddleware");

router.use(authenticateToken, authorizeRoles("patient"));

router.get("/my", getMyAnalyses);
router.post("/", analysisUpload.single("file"), uploadMedicalAnalysis);
router.delete("/:id", deleteMyAnalysis);

module.exports = router;