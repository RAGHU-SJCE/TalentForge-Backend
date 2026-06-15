const express = require("express");

const router = express.Router();

const {
  saveJob,
  getSavedJobs,
  unsaveJob,
} = require("../controllers/savedJobController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Saved Jobs
 *   description: Saved Jobs Management APIs
 */

/**
 * @swagger
 * /api/saved-jobs/{jobId}:
 *   post:
 *     summary: Save a job
 *     tags: [Saved Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Job saved successfully
 */
router.post(
  "/:jobId",
  protect,
  authorizeRoles("student", "professional"),
  saveJob
);

/**
 * @swagger
 * /api/saved-jobs:
 *   get:
 *     summary: Get all saved jobs
 *     tags: [Saved Jobs]
 *     responses:
 *       200:
 *         description: Saved jobs fetched successfully
 */
router.get(
  "/",
  protect,
  authorizeRoles("student", "professional"),
  getSavedJobs
);

/**
 * @swagger
 * /api/saved-jobs/{jobId}:
 *   delete:
 *     summary: Remove saved job
 *     tags: [Saved Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Saved job removed successfully
 */
router.delete(
  "/:jobId",
  protect,
  authorizeRoles("student", "professional"),
  unsaveJob
);

module.exports = router;