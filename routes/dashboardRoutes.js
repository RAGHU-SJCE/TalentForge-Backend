const express = require("express");

const router = express.Router();

const {
  getStudentDashboard,
  getRecruiterDashboard,
} = require("../controllers/dashboardController");

const {
  protect,
} = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard Analytics APIs
 */

/**
 * @swagger
 * /api/dashboard/student:
 *   get:
 *     summary: Get student dashboard analytics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Student dashboard data fetched successfully
 */
router.get(
  "/student",
  protect,
  getStudentDashboard
);

/**
 * @swagger
 * /api/dashboard/recruiter:
 *   get:
 *     summary: Get recruiter dashboard analytics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Recruiter dashboard data fetched successfully
 */
router.get(
  "/recruiter",
  protect,
  getRecruiterDashboard
);

module.exports = router;