const mongoose = require("mongoose");

const projectStarSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    starredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// One star per user per project
projectStarSchema.index({ project: 1, starredBy: 1 }, { unique: true });

module.exports = mongoose.model("ProjectStar", projectStarSchema);
