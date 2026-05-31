const express = require("express");

const router = express.Router();

const {
  updateCompanyProfile,
  getMyCompanyProfile,
  getCompanyById,
} = require(
  "../controllers/companyController"
);

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company Profile Management APIs
 */

/**
 * @swagger
 * /api/company/profile:
 *   put:
 *     summary: Update company profile
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: TalentForge Pvt Ltd
 *               companyWebsite:
 *                 type: string
 *                 example: https://talentforge.com
 *               companyDescription:
 *                 type: string
 *                 example: Recruitment and Talent Management Platform
 *               industry:
 *                 type: string
 *                 example: Software
 *     responses:
 *       200:
 *         description: Company profile updated successfully
 */
router.put(
  "/profile",
  protect,
  authorizeRoles("recruiter"),
  updateCompanyProfile
);

/**
 * @swagger
 * /api/company/profile:
 *   get:
 *     summary: Get own company profile
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: Company profile fetched successfully
 */
router.get(
  "/profile",
  protect,
  authorizeRoles("recruiter"),
  getMyCompanyProfile
);

/**
 * @swagger
 * /api/company/{id}:
 *   get:
 *     summary: Get company profile by ID
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company profile fetched successfully
 */
router.get(
  "/:id",
  getCompanyById
);

module.exports = router;