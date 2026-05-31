const express = require("express");

const router = express.Router();

const {
  getProfile,
  uploadResume,
  updateSkills,
  updateBio,
  getAllStudents,
  getStudentById,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const upload = require(
  "../middleware/uploadMiddleware"
);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Profile Management APIs
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged in user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 */
router.get("/profile", protect, getProfile);

/**
 * @swagger
 * /api/users/upload-resume:
 *   put:
 *     summary: Upload user resume
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 */
router.put(
  "/upload-resume",
  protect,
  upload.single("resume"),
  uploadResume
);

/**
 * @swagger
 * /api/users/skills:
 *   put:
 *     summary: Update user skills
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - React
 *                   - Node.js
 *                   - MongoDB
 *     responses:
 *       200:
 *         description: Skills updated successfully
 */
router.put("/skills", protect, updateSkills);

/**
 * @swagger
 * /api/users/bio:
 *   put:
 *     summary: Update user bio
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 example: Full Stack Developer
 *     responses:
 *       200:
 *         description: Bio updated successfully
 */
router.put("/bio", protect, updateBio);

/**
 * @swagger
 * /api/users/students:
 *   get:
 *     summary: Get all students
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Students fetched successfully
 */
router.get("/students", protect, getAllStudents);

/**
 * @swagger
 * /api/users/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student fetched successfully
 */
router.get("/students/:id", protect, getStudentById);

module.exports = router;