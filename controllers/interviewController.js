const Interview = require("../models/Interview");
const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");
const socket = require("../socket");

// ===================================
// Schedule Interview
// ===================================
const scheduleInterview = async (req, res) => {
  try {
    const { candidateId, jobId, interviewDate, meetingLink, location, notes } = req.body;
    const recruiterId = req.user.id;

    // Validate Job and Candidate
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const candidate = await User.findById(candidateId);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

    if (job.recruiter.toString() !== recruiterId) {
      return res.status(403).json({ success: false, message: "Not Authorized" });
    }

    if (!meetingLink && !location) {
      return res.status(400).json({ success: false, message: "Provide meeting link or location" });
    }

    const existingInterview = await Interview.findOne({
      candidate: candidateId,
      job: jobId,
      status: { $ne: "Cancelled" },
    });

    if (existingInterview) {
      return res.status(400).json({ success: false, message: "Interview already exists for this candidate" });
    }

    const application = await Application.findOne({ student: candidateId, job: jobId });
    if (!application) {
      return res.status(400).json({ success: false, message: "Candidate has not applied to this job" });
    }

    application.status = "Interview";
    await application.save();

    const interview = await Interview.create({
      candidate: candidateId,
      recruiter: recruiterId,
      job: jobId,
      interviewDate,
      meetingLink,
      location,
      notes,
    });

    // Create Notification
    await Notification.create({
      recipient: candidateId,
      message: `An interview has been scheduled for the ${job.title} position.`,
      type: "interview",
    });

    const candidateSocketId = socket.getUserSocket(candidateId);
    if (candidateSocketId) {
      socket.getIO().to(candidateSocketId).emit("notification", {
        message: `An interview has been scheduled for the ${job.title} position.`,
        type: "interview",
      });
    }

    // Send Email
    sendEmail({
      to: candidate.email,
      subject: `Interview Scheduled: ${job.title}`,
      html: `
        <h2>Interview Scheduled</h2>
        <p>Hi ${candidate.fullName},</p>
        <p>An interview has been scheduled for the <strong>${job.title}</strong> role at <strong>${job.company}</strong>.</p>
        <p><strong>Date & Time:</strong> ${new Date(interviewDate).toLocaleString()}</p>
        ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ""}
        ${location ? `<p><strong>Location:</strong> ${location}</p>` : ""}
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
        <p>Best regards,<br>TalentForge Team</p>
      `,
    }).catch(err => console.log("Email Error:", err.message));

    res.status(201).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================================
// Update Interview
// ===================================
const updateInterview = async (req, res) => {
  try {
    const { interviewDate, meetingLink, location, notes, status } = req.body;
    
    const allowedStatuses = ["Scheduled", "Completed", "Cancelled"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    let interview = await Interview.findById(req.params.id).populate("candidate").populate("job");
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

    if (interview.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not Authorized" });
    }

    interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { interviewDate, meetingLink, location, notes, status },
      { new: true }
    ).populate("candidate").populate("job");

    // Create Notification
    await Notification.create({
      recipient: interview.candidate._id,
      message: `Your interview for ${interview.job.title} has been updated.`,
      type: "interview",
    });

    const candidateSocketId = socket.getUserSocket(interview.candidate._id);
    if (candidateSocketId) {
      socket.getIO().to(candidateSocketId).emit("notification", {
        message: `Your interview for ${interview.job.title} has been updated.`,
        type: "interview",
      });
    }

    // Send Email
    sendEmail({
      to: interview.candidate.email,
      subject: `Interview Updated: ${interview.job.title}`,
      html: `
        <h2>Interview Updated</h2>
        <p>Hi ${interview.candidate.fullName},</p>
        <p>Your interview for the <strong>${interview.job.title}</strong> role has been updated.</p>
        <p><strong>New Date & Time:</strong> ${new Date(interview.interviewDate).toLocaleString()}</p>
        <p><strong>Status:</strong> ${interview.status}</p>
        ${interview.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${interview.meetingLink}">${interview.meetingLink}</a></p>` : ""}
        ${interview.location ? `<p><strong>Location:</strong> ${interview.location}</p>` : ""}
        ${interview.notes ? `<p><strong>Notes:</strong> ${interview.notes}</p>` : ""}
      `,
    }).catch(err => console.log("Email Error:", err.message));

    res.status(200).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================================
// Cancel Interview
// ===================================
const cancelInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id).populate("candidate").populate("job");
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

    if (interview.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not Authorized" });
    }

    interview.status = "Cancelled";
    await interview.save();

    // Create Notification
    await Notification.create({
      recipient: interview.candidate._id,
      message: `Your interview for ${interview.job.title} has been cancelled.`,
      type: "interview",
    });

    const candidateSocketId = socket.getUserSocket(interview.candidate._id);
    if (candidateSocketId) {
      socket.getIO().to(candidateSocketId).emit("notification", {
        message: `Your interview for ${interview.job.title} has been cancelled.`,
        type: "interview",
      });
    }

    // Send Email
    sendEmail({
      to: interview.candidate.email,
      subject: `Interview Cancelled: ${interview.job.title}`,
      html: `
        <h2>Interview Cancelled</h2>
        <p>Hi ${interview.candidate.fullName},</p>
        <p>We regret to inform you that your interview for the <strong>${interview.job.title}</strong> role has been cancelled.</p>
        <p>Please contact the recruiter if you have any questions.</p>
      `,
    }).catch(err => console.log("Email Error:", err.message));

    res.status(200).json({ success: true, message: "Interview Cancelled", interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================================
// Get Interviews for a Job
// ===================================
const getInterviewsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not Authorized" });
    }

    const interviews = await Interview.find({ job: req.params.jobId })
      .populate("candidate", "fullName email resume")
      .sort({ interviewDate: 1 });
      
    res.status(200).json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================================
// Get Student's Own Interviews
// ===================================
const getStudentInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidate: req.user.id })
      .populate("job", "title company location")
      .populate("recruiter", "fullName email")
      .sort({ interviewDate: 1 });
      
    res.status(200).json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  scheduleInterview,
  updateInterview,
  cancelInterview,
  getInterviewsForJob,
  getStudentInterviews,
};
