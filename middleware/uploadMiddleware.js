const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Resume upload directory
const resumeDir = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });

// Profile picture upload directory
const profilePicDir = path.join(__dirname, "../uploads/profile-pictures");
if (!fs.existsSync(profilePicDir)) fs.mkdirSync(profilePicDir, { recursive: true });

// Resume storage
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, resumeDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const resumeFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF, DOC and DOCX files are allowed"), false);
};

// Profile picture storage
const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profilePicDir),
  filename: (req, file, cb) => cb(null, `pp_${Date.now()}${path.extname(file.originalname)}`),
});

const profilePicFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files (JPG, PNG, WEBP) are allowed"), false);
};

const upload = multer({ storage: resumeStorage, fileFilter: resumeFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadProfilePic = multer({ storage: profilePicStorage, fileFilter: profilePicFilter, limits: { fileSize: 3 * 1024 * 1024 } });

module.exports = upload;
module.exports.uploadProfilePic = uploadProfilePic;