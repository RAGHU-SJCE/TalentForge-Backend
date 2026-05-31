const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/resumes");

console.log("UPLOAD DIR:", uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("DESTINATION CALLED");
    console.log(file);

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    console.log("FILENAME CALLED");
    console.log(file.originalname);

    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

module.exports = upload;