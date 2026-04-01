const express = require("express");
const router = express.Router();

const {
  createMedicalAnalysisForPatient,
  getMyAnalyses,
  updatePatientAnalysis,
  removeMyAnalysis, 
} = require("../controllers/analysisController");

const { authenticateToken } = require("../middleware/authMiddleware");
const { analysisUpload } = require("../middleware/uploadMiddleware");

router.use(authenticateToken);

router.get("/my", getMyAnalyses);
router.post("/upload", analysisUpload.single("file"), createMedicalAnalysisForPatient);
router.put("/:analysisId", analysisUpload.single("file"), updatePatientAnalysis);

router.delete("/:id", removeMyAnalysis); 

module.exports = router;