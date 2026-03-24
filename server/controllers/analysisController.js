const fs = require("fs");
const path = require("path");
const {
  createMedicalAnalysis,
  getMedicalAnalysesByUser,
  getMedicalAnalysisById,
  deleteMedicalAnalysis,
} = require("../models/analysisModel");

const uploadMedicalAnalysis = async (req, res) => {
  try {
    const { title, analysisType, labName, resultStatus } = req.body;

    if (!title || !analysisType || !req.file) {
      return res.status(400).json({
        message: "Title, analysis type and file are required.",
      });
    }

    const relativePath = `/uploads/analyses/${req.file.filename}`;

    const analysisId = await createMedicalAnalysis({
      userId: req.user.id,
      title,
      analysisType,
      labName,
      resultStatus,
      fileName: req.file.originalname,
      filePath: relativePath,
    });

    return res.status(201).json({
      message: "Analysis uploaded successfully.",
      analysisId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to upload analysis.",
      error: error.message,
    });
  }
};

const getMyAnalyses = async (req, res) => {
  try {
    const analyses = await getMedicalAnalysesByUser(req.user.id);
    return res.status(200).json(analyses);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load analyses.",
      error: error.message,
    });
  }
};

const deleteMyAnalysis = async (req, res) => {
  try {
    const analysisId = Number(req.params.id);
    const analysis = await getMedicalAnalysisById(analysisId);

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found.",
      });
    }

    if (analysis.user_id !== req.user.id) {
      return res.status(403).json({
        message: "You cannot delete this analysis.",
      });
    }

    const absolutePath = path.join(__dirname, "..", analysis.file_path);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await deleteMedicalAnalysis(analysisId);

    return res.status(200).json({
      message: "Analysis deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete analysis.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadMedicalAnalysis,
  getMyAnalyses,
  deleteMyAnalysis,
};