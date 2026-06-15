const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAdminDashboard,
  updateUserRole,
  getAllProjects,
  deleteProject,
} = require("../controllers/adminController");


const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin Management APIs
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard analytics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin dashboard fetched successfully
 */
router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete(
  "/users/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

router.put(
  "/users/:id/role",
  protect,
  authorizeRoles("admin"),
  updateUserRole
);



/**
 * @swagger
 * /api/admin/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Jobs fetched successfully
 */
router.get(
  "/jobs",
  protect,
  authorizeRoles("admin"),
  getAllJobs
);

/**
 * @swagger
 * /api/admin/jobs/{id}:
 *   delete:
 *     summary: Delete job
 *     tags: [Admin]
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
  "/jobs/:id",
  protect,
  authorizeRoles("admin"),
  deleteJob
);

router.get(
  "/projects",
  protect,
  authorizeRoles("admin"),
  getAllProjects
);

router.delete(
  "/projects/:id",
  protect,
  authorizeRoles("admin"),
  deleteProject
);

module.exports = router;