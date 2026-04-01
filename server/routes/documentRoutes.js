const express = require("express");
const router = express.Router();

const {
  uploadMedicalDocumentForPatient,
  getMyDocuments,
  updatePatientDocument,
  removeMyDocument,
} = require("../controllers/documentController");
const { authenticateToken } = require("../middleware/authMiddleware");

const { documentUpload } = require("../middleware/uploadMiddleware");

router.use(authenticateToken);

router.get("/my", getMyDocuments);

router.post("/upload", documentUpload.single("file"), uploadMedicalDocumentForPatient);
router.put("/:documentId", documentUpload.single("file"), updatePatientDocument);

router.delete("/:id", removeMyDocument);

module.exports = router;