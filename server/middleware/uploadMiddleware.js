const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDirectory = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const createStorage = (subFolder) => {
  const uploadFolder = path.join(__dirname, "..", "uploads", subFolder);
  ensureDirectory(uploadFolder);

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${Date.now()}-${safeName}`);
    },
  });
};

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF, JPG and PNG files are allowed."));
  }

  cb(null, true);
};

const documentUpload = multer({
  storage: createStorage("documents"),
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

const analysisUpload = multer({
  storage: createStorage("analyses"),
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

module.exports = {
  documentUpload,
  analysisUpload,
};