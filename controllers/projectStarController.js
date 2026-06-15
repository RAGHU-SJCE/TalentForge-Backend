const ProjectStar = require("../models/ProjectStar");
const Project = require("../models/Project");

// Toggle star on a project
exports.toggleStar = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // Can't star your own
    if (project.createdBy.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: "Cannot star your own project" });
    }

    const existing = await ProjectStar.findOne({ project: projectId, starredBy: req.user.id });

    if (existing) {
      await existing.deleteOne();
      const count = await ProjectStar.countDocuments({ project: projectId });
      return res.status(200).json({ success: true, starred: false, starCount: count });
    }

    await ProjectStar.create({ project: projectId, starredBy: req.user.id });
    const count = await ProjectStar.countDocuments({ project: projectId });
    res.status(201).json({ success: true, starred: true, starCount: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get star count + whether current user has starred for a project
exports.getProjectStars = async (req, res) => {
  try {
    const { projectId } = req.params;
    const count = await ProjectStar.countDocuments({ project: projectId });
    const mystar = await ProjectStar.findOne({ project: projectId, starredBy: req.user.id });
    res.status(200).json({ success: true, starCount: count, starred: !!mystar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get stars for multiple projects at once (bulk)
exports.getBulkProjectStars = async (req, res) => {
  try {
    const { projectIds } = req.body; // array of IDs
    if (!projectIds?.length) return res.status(200).json({ success: true, data: {} });

    const stars = await ProjectStar.find({ project: { $in: projectIds } });
    const data = {};
    for (const pid of projectIds) {
      const pidStr = pid.toString();
      const count = stars.filter(s => s.project.toString() === pidStr).length;
      const mystar = stars.find(s => s.project.toString() === pidStr && s.starredBy.toString() === req.user.id);
      data[pidStr] = { starCount: count, starred: !!mystar };
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
