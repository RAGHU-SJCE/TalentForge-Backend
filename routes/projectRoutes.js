const express = require("express");

const router = express.Router();

const {
  createProject,
  getMyProjects,
  getAllProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

// Create
router.post("/", protect, createProject);

// My Projects
router.get("/my-projects", protect, getMyProjects);

// All Projects
router.get("/", getAllProjects);

// Update
router.put("/:id", protect, updateProject);

// Delete
router.delete("/:id", protect, deleteProject);

module.exports = router;