const express = require("express");

const router = express.Router();

const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job Application APIs
 */

/**
 * @swagger
 * /api/applications/apply/{jobId}:
 *   post:
 *     summary: Apply to a job
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 */
router.post(
  "/apply/:jobId",
  protect,
  authorizeRoles("student", "professional"),
  applyToJob
);

/**
 * @swagger
 * /api/applications/my-applications:
 *   get:
 *     summary: Get my applications
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: List of user applications
 */
router.get(
  "/my-applications",
  protect,
  authorizeRoles("student", "professional"),
  getMyApplications
);

/**
 * @swagger
 * /api/applications/job/{jobId}:
 *   get:
 *     summary: Get applicants for a job
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Applicants fetched successfully
 */
router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter", "admin"),
  getApplicantsForJob
);

/**
 * @swagger
 * /api/applications/{applicationId}/status:
 *   put:
 *     summary: Update application status
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: Shortlisted
 *     responses:
 *       200:
 *         description: Application status updated
 */
router.put(
  "/:applicationId/status",
  protect,
  authorizeRoles("recruiter", "admin"),
  updateApplicationStatus
);

module.exports = router;