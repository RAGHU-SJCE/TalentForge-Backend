const express = require("express");

const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");
const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job Management APIs
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Frontend Developer
 *               company:
 *                 type: string
 *                 example: TalentForge
 *               location:
 *                 type: string
 *                 example: Bangalore
 *               salary:
 *                 type: number
 *                 example: 600000
 *               description:
 *                 type: string
 *                 example: React Developer Required
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.post(
  "/",
  protect,
  authorizeRoles("recruiter", "admin"),
  createJob
);


router.get(
  "/my-jobs",
  protect,
  authorizeRoles("recruiter"),
  getMyJobs
);
/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of all jobs
 */
router.get("/", getAllJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job fetched successfully
 */
router.get("/:id", getJobById);

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Job updated successfully
 */
router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter", "admin"),
  updateJob
);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles("recruiter", "admin"),
  deleteJob
);

module.exports = router;