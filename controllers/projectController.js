const Project = require("../models/Project");

// Create Project
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      githubLink,
      projectLink,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      technologies,
      githubLink,
      projectLink,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged In User Projects
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      createdBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "createdBy",
      "fullName email role"
    );

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getAllProjects,
  updateProject,
  deleteProject,
};