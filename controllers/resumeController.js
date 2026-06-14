/**
 * @deprecated This controller is deprecated. Use userController.js instead.
 * This file will be removed in a future cleanup commit.
 */
const User = require("../models/User");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    await User.findByIdAndUpdate(
      req.user.id,
      {
        resume: resumeUrl,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl,

      size: {
        bytes: req.file.size,
        kb: Number((req.file.size / 1024).toFixed(2)),
        mb: Number((req.file.size / (1024 * 1024)).toFixed(2)),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadResume,
};