const express = require("express");
const router = express.Router();

const {
  uploadMedicalDocument,
  getMyDocuments,
  deleteMyDocument,
} = require("../controllers/documentController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { documentUpload } = require("../middleware/uploadMiddleware");

router.use(authenticateToken, authorizeRoles("patient"));

router.get("/my", getMyDocuments);
router.post("/", documentUpload.single("file"), uploadMedicalDocument);
router.delete("/:id", deleteMyDocument);

module.exports = router;