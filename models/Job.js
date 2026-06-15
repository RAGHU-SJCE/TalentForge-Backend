const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },

    experienceLevel: {
      type: String,
      enum: ["Entry", "Mid", "Senior", "Lead"],
      default: "Entry",
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    applicationDeadline: {
      type: Date,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);