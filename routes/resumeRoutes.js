/**
 * @deprecated This route is deprecated. Use /api/users/upload-resume instead.
 * This file will be removed in a future cleanup commit.
 */
const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume } = require("../controllers/resumeController");

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

module.exports = router;