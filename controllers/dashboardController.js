const User = require("../models/User");
const Project = require("../models/Project");
const Job = require("../models/Job");
const Application = require("../models/Application");


// ===================================
// Student Dashboard
// ===================================
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    const totalProjects = await Project.countDocuments({
      createdBy: studentId,
    });

    const totalApplications =
      await Application.countDocuments({
        student: studentId,
      });

    const user = await User.findById(studentId);

    const skillsCount = user.skills.length;

    const recentApplications =
      await Application.find({
        student: studentId,
      })
        .populate("job", "title company")
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        totalProjects,
        totalApplications,
        skillsCount,
        recentApplications,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===================================
// Recruiter Dashboard
// ===================================
const getRecruiterDashboard = async (
  req,
  res
) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await Job.find({
      recruiter: recruiterId,
    });

    const jobIds = jobs.map(
      (job) => job._id
    );

    const totalJobsPosted = jobs.length;

    const applicationStats =
      await Application.aggregate([
        {
          $match: {
            job: {
              $in: jobIds,
            },
          },
        },
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    let totalApplicationsReceived = 0;
    let totalShortlistedCandidates = 0;
    let totalSelectedCandidates = 0;

    applicationStats.forEach((item) => {
      totalApplicationsReceived +=
        item.count;

      if (
        item._id === "Shortlisted"
      ) {
        totalShortlistedCandidates =
          item.count;
      }

      if (
        item._id === "Selected"
      ) {
        totalSelectedCandidates =
          item.count;
      }
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalJobsPosted,
        totalApplicationsReceived,
        totalShortlistedCandidates,
        totalSelectedCandidates,
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
  getStudentDashboard,
  getRecruiterDashboard,
};