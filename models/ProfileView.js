const mongoose = require("mongoose");

const profileViewModel = new mongoose.Schema(
  {
    viewedProfile: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    viewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Prevent duplicate tracking for same viewer same day (we'll handle this in logic)
profileViewModel.index({ viewedProfile: 1, viewedBy: 1, createdAt: 1 });

module.exports = mongoose.model("ProfileView", profileViewModel);
