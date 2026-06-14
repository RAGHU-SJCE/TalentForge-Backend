const express = require("express");
const router = express.Router();

const {
  scheduleInterview,
  updateInterview,
  cancelInterview,
  getInterviewsForJob,
  getStudentInterviews,
} = require("../controllers/interviewController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Recruiter routes
router.post("/schedule", protect, authorizeRoles("recruiter"), scheduleInterview);
router.put("/:id", protect, authorizeRoles("recruiter"), updateInterview);
router.put("/:id/cancel", protect, authorizeRoles("recruiter"), cancelInterview);
router.get("/job/:jobId", protect, authorizeRoles("recruiter"), getInterviewsForJob);

// Student routes
router.get("/student", protect, authorizeRoles("student"), getStudentInterviews);

module.exports = router;
