const User = require("../models/User");
const Job = require("../models/Job");
const Project = require("../models/Project");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const SavedJob = require("../models/SavedJob");


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
// Delete User + Cascade Cleanup
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

    // ====================================
    // Delete Student Related Data
    // ====================================

    await Project.deleteMany({
      createdBy: user._id,
    });

    await Application.deleteMany({
      student: user._id,
    });

    await SavedJob.deleteMany({
      student: user._id,
    });

    await Notification.deleteMany({
      recipient: user._id,
    });

    // ====================================
    // If Recruiter
    // Delete Jobs + Applications
    // ====================================

    if (user.role === "recruiter") {
  const recruiterJobs =
    await Job.find({
      recruiter: user._id,
    });

  const recruiterJobIds =
    recruiterJobs.map(
      (job) => job._id
    );

  // Delete applications
  await Application.deleteMany({
    job: {
      $in: recruiterJobIds,
    },
  });

  // Delete saved jobs
  await SavedJob.deleteMany({
    job: {
      $in: recruiterJobIds,
    },
  });

  // Delete recruiter jobs
  await Job.deleteMany({
    recruiter: user._id,
  });
}

    // ====================================
    // Delete User
    // ====================================

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "User and related data deleted successfully",
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
      .populate(
        "recruiter",
        "fullName email"
      );

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
// Delete Job + Applications
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

    // Delete Applications
    await Application.deleteMany({
      job: job._id,
    });

    // Delete Saved Jobs
    await SavedJob.deleteMany({
      job: job._id,
    });

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Job and related data deleted successfully",
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

// Update User Role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["student", "professional", "recruiter", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "fullName email");
    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    await project.deleteOne();
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAdminDashboard,
  updateUserRole,
  getAllProjects,
  deleteProject,
};