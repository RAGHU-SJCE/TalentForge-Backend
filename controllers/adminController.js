const User = require("../models/User");
const Job = require("../models/Job");
const Project = require("../models/Project");
const Application = require("../models/Application");


// ====================================
// Get All Users
// ====================================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ====================================
// Delete User
// ====================================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ====================================
// Get All Jobs
// ====================================
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("recruiter", "fullName email");

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ====================================
// Delete Job
// ====================================
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ====================================
// Admin Dashboard Analytics
// ====================================
const getAdminDashboard = async (
  req,
  res
) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const totalStudents =
      await User.countDocuments({
        role: "student",
      });

    const totalRecruiters =
      await User.countDocuments({
        role: "recruiter",
      });

    const totalJobs =
      await Job.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    const totalProjects =
      await Project.countDocuments();

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalStudents,
        totalRecruiters,
        totalJobs,
        totalApplications,
        totalProjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAdminDashboard,
};