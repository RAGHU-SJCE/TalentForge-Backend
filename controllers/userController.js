const User = require("../models/User");

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload Resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        resume: req.file.path,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Skills
const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skills },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Skills Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Bio
const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bio },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Bio Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Students
const getAllStudents = async (req, res) => {
  try {
    const { skill } = req.query;

    let filter = {
      role: "student",
    };

    if (skill) {
      filter.skills = {
        $in: [skill],
      };
    }

    const students = await User.find(filter).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Student By ID
const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(
      req.params.id
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  uploadResume,
  updateSkills,
  updateBio,
  getAllStudents,
  getStudentById,
};