const fs = require("fs");
const path = require("path");
const {
  createMedicalDocument,
  getMedicalDocumentsByUser,
  getMedicalDocumentById,
  deleteMedicalDocument,
} = require("../models/documentModel");

const uploadMedicalDocument = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category || !req.file) {
      return res.status(400).json({
        message: "Title, category and file are required.",
      });
    }

    const relativePath = `/uploads/documents/${req.file.filename}`;

    const documentId = await createMedicalDocument({
      userId: req.user.id,
      title,
      category,
      fileName: req.file.originalname,
      filePath: relativePath,
    });

    return res.status(201).json({
      message: "Document uploaded successfully.",
      documentId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to upload document.",
      error: error.message,
    });
  }
};

const getMyDocuments = async (req, res) => {
  try {
    const documents = await getMedicalDocumentsByUser(req.user.id);
    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load documents.",
      error: error.message,
    });
  }
};

const deleteMyDocument = async (req, res) => {
  try {
    const documentId = Number(req.params.id);
    const document = await getMedicalDocumentById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    if (document.user_id !== req.user.id) {
      return res.status(403).json({
        message: "You cannot delete this document.",
      });
    }

    const absolutePath = path.join(__dirname, "..", document.file_path);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await deleteMedicalDocument(documentId);

    return res.status(200).json({
      message: "Document deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete document.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadMedicalDocument,
  getMyDocuments,
  deleteMyDocument,
};