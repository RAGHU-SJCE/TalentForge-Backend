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

    // Profile Completion Algorithm
    let profileCompletionPercentage = 0;
    const missingProfileActions = [];

    if (user.resume) {
      profileCompletionPercentage += 25;
    } else {
      missingProfileActions.push("Upload your resume");
    }

    if (skillsCount > 0) {
      profileCompletionPercentage += 25;
    } else {
      missingProfileActions.push("Add your skills");
    }

    if (user.bio) {
      profileCompletionPercentage += 15;
    } else {
      missingProfileActions.push("Add a bio to your profile");
    }

    if (totalProjects > 0) {
      profileCompletionPercentage += 20;
    } else {
      missingProfileActions.push("Add a project");
    }

    if (user.profilePicture) {
      profileCompletionPercentage += 15;
    } else {
      missingProfileActions.push("Upload a profile picture");
    }

    const profileCompletion = {
      percentage: profileCompletionPercentage,
      missingActions: missingProfileActions
    };

    // Fetch next upcoming interview
    const nextInterview = await Interview.findOne({
      candidate: studentId,
      status: "Scheduled",
      interviewDate: { $gte: new Date() }
    })
      .populate("job", "title company")
      .sort({ interviewDate: 1 });

    res.status(200).json({
      success: true,
      dashboard: {
        totalProjects,
        totalApplications,
        skillsCount,
        recentApplications,
        profileCompletion,
        nextInterview,
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
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job", "title skillsRequired")
      .populate("student", "fullName email skills profilePicture");
    
    const totalApplicationsReceived = applications.length;

    // Aggregations
    let totalShortlistedCandidates = 0;
    let totalInterviewedCandidates = 0;
    let totalSelectedCandidates = 0;
    let totalRejectedCandidates = 0;

    const statusCounts = {};
    const jobsCountMap = {};
    const monthlyCounts = {};

    let totalMatchScore = 0;
    let bestCandidate = null;

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

      // Algorithmic Match Score Calculation
      let matchCount = 0;
      const jobSkills = app.job?.skillsRequired ? app.job.skillsRequired.map(s => s.toLowerCase().trim()) : [];
      const studentSkills = app.student?.skills ? app.student.skills.map(s => s.toLowerCase().trim()) : [];

      jobSkills.forEach(skill => {
        if (studentSkills.includes(skill)) matchCount++;
      });

      const matchPercentage = jobSkills.length > 0 ? Math.round((matchCount / jobSkills.length) * 100) : 100;
      totalMatchScore += matchPercentage;

      if (!bestCandidate || matchPercentage > bestCandidate.matchPercentage) {
        bestCandidate = {
          student: app.student,
          job: app.job,
          matchPercentage,
          applicationId: app._id
        };
      }
    });

    const averageMatchScore = totalApplicationsReceived > 0 
      ? Math.round(totalMatchScore / totalApplicationsReceived) 
      : 0;

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
    const upcomingInterviews = await Interview.find({
      recruiter: recruiterId,
      status: "Scheduled"
    })
      .populate("candidate", "fullName email")
      .populate("job", "title")
      .sort({ interviewDate: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        totalJobsPosted,
        totalApplicationsReceived,
        totalShortlistedCandidates,
        totalInterviewedCandidates,
        totalSelectedCandidates,
        totalRejectedCandidates,
        upcomingInterviews, // Now an array of objects
        statusDistribution,
        applicationsPerJob,
        monthlyApplications,
        averageMatchScore,
        bestCandidate
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