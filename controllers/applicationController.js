const Application = require("../models/Application");
const User = require("../models/User");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

// =====================================
// Student - Apply to Job
// =====================================
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const student = await User.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!student.resume) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload resume before applying",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const existingApplication =
      await Application.findOne({
        student: req.user.id,
        job: jobId,
      });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message:
          "Already applied for this job",
      });
    }

    const application =
      await Application.create({
        student: req.user.id,
        job: jobId,
        resume: student.resume,
      });

    // Notification for Recruiter
    await Notification.create({
      recipient: job.recruiter,
      message: `${student.fullName} applied for ${job.title}`,
      type: "application",
    });

    // Get Recruiter Details
    const recruiter = await User.findById(
      job.recruiter
    );

    // Email to Student
    sendEmail({
      to: student.email,
      subject: "Application Submitted",
      html: `
        <h2>Application Submitted ✅</h2>

        <p>Hello ${student.fullName},</p>

        <p>
          You have successfully applied for
          <strong>${job.title}</strong>.
        </p>

        <p>Good luck!</p>
      `,
    }).catch((err) =>
      console.log(err.message)
    );

    // Email to Recruiter
    if (recruiter) {
      sendEmail({
        to: recruiter.email,
        subject: "New Job Application",
        html: `
          <h2>New Applicant</h2>

          <p>
            ${student.fullName}
            has applied for
            <strong>${job.title}</strong>.
          </p>
        `,
      }).catch((err) =>
        console.log(err.message)
      );
    }

    res.status(201).json({
      success: true,
      message:
        "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Student - View My Applications
// =====================================
const getMyApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        student: req.user.id,
      })
        .populate("job")
        .populate(
          "student",
          "fullName email"
        );

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Recruiter - View Applicants
// =====================================
const getApplicantsForJob = async (
  req,
  res
) => {
  try {
    const job = await Job.findById(
      req.params.jobId
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (
      job.recruiter.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    const applications =
      await Application.find({
        job: req.params.jobId,
      })
        .populate(
          "student",
          "fullName email skills bio resume"
        )
        .populate(
          "job",
          "title company"
        );

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Recruiter - Update Application Status
// =====================================
const updateApplicationStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      const application =
        await Application.findById(
          req.params.applicationId
        )
          .populate("job")
          .populate("student");

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      if (
        application.job.recruiter.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Not Authorized",
        });
      }

      const allowedStatuses = [
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Allowed values: Applied, Shortlisted, Interview, Selected, Rejected",
        });
      }

      application.status = status;

      await application.save();

      let notificationType =
        "application";

      if (status === "Shortlisted") {
        notificationType =
          "shortlisted";
      }

      if (status === "Interview") {
        notificationType =
          "interview";
      }

      if (status === "Selected") {
        notificationType =
          "selected";
      }

      if (status === "Rejected") {
        notificationType =
          "rejected";
      }

      // Notification for Student
      await Notification.create({
        recipient:
          application.student,
        message: `Your application for ${application.job.title} has been ${status}`,
        type: notificationType,
      });

      // Email Student On Status Change
      let emailSubject =
        "Application Status Updated";

      let emailMessage = `
        <h2>Application Update</h2>

        <p>
          Your application for
          <strong>${application.job.title}</strong>
          has been updated to:
          <strong>${status}</strong>
        </p>
      `;

      if (status === "Shortlisted") {
        emailSubject =
          "Congratulations! You are Shortlisted 🎉";

        emailMessage = `
          <h2>Congratulations 🎉</h2>

          <p>
            You have been shortlisted for
            <strong>${application.job.title}</strong>.
          </p>
        `;
      }

      if (status === "Rejected") {
        emailSubject =
          "Application Status Update";

        emailMessage = `
          <h2>Application Update</h2>

          <p>
            Thank you for applying for
            <strong>${application.job.title}</strong>.
          </p>

          <p>
            Unfortunately you were not selected.
          </p>
        `;
      }

      sendEmail({
        to: application.student.email,
        subject: emailSubject,
        html: emailMessage,
      }).catch((err) =>
        console.log(err.message)
      );

      res.status(200).json({
        success: true,
        message:
          "Application status updated",
        application,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
};