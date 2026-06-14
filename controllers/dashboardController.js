const User = require("../models/User");
const Project = require("../models/Project");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");


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
const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await Job.find({ recruiter: recruiterId });
    const jobIds = jobs.map((job) => job._id);
    const totalJobsPosted = jobs.length;

    // Fetch all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } }).populate("job", "title");
    
    const totalApplicationsReceived = applications.length;

    // Aggregations
    let totalShortlistedCandidates = 0;
    let totalInterviewedCandidates = 0;
    let totalSelectedCandidates = 0;
    let totalRejectedCandidates = 0;

    const statusCounts = {};
    const jobsCountMap = {};
    const monthlyCounts = {};

    applications.forEach((app) => {
      // Status aggregation
      if (app.status === "Shortlisted") totalShortlistedCandidates++;
      if (app.status === "Interview") totalInterviewedCandidates++;
      if (app.status === "Selected") totalSelectedCandidates++;
      if (app.status === "Rejected") totalRejectedCandidates++;

      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;

      // Apps per job aggregation
      const jobTitle = app.job?.title || "Unknown";
      jobsCountMap[jobTitle] = (jobsCountMap[jobTitle] || 0) + 1;

      // Monthly aggregation
      const monthYear = new Date(app.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
    });

    const statusDistribution = Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key]
    }));

    const applicationsPerJob = Object.keys(jobsCountMap).map(key => ({
      jobTitle: key,
      count: jobsCountMap[key]
    }));

    const monthlyApplications = Object.keys(monthlyCounts).map(key => ({
      month: key,
      count: monthlyCounts[key]
    }));

    // Upcoming Interviews
    const upcomingInterviews = await Interview.countDocuments({
      recruiter: recruiterId,
      status: "Scheduled"
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalJobsPosted,
        totalApplicationsReceived,
        totalShortlistedCandidates,
        totalInterviewedCandidates,
        totalSelectedCandidates,
        totalRejectedCandidates,
        upcomingInterviews,
        statusDistribution,
        applicationsPerJob,
        monthlyApplications
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