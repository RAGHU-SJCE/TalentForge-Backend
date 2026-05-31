const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

const saveJob = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const alreadySaved = await SavedJob.findOne({
      student: studentId,
      job: jobId,
    });

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Job already saved",
      });
    }

    const savedJob = await SavedJob.create({
      student: studentId,
      job: jobId,
    });

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      savedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const studentId = req.user.id;

    const savedJobs = await SavedJob.find({
      student: studentId,
    }).populate("job");

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const unsaveJob = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOneAndDelete({
      student: studentId,
      job: jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job removed from saved list",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  unsaveJob,
};