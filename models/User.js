const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["student", "professional", "recruiter", "admin"],
      default: "student",
    },

    skills: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    companyName: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: Date,
    },

    location: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    linkedinUrl: {
      type: String,
      default: "",
    },

    portfolioUrl: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    certifications: {
      type: [String],
      default: [],
    },

    companyWebsite: {
      type: String,
      default: "",
    },

    companyDescription: {
  type: String,
  default: "",
},

    companyLogo: {
  type: String,
  default: "",
},

    industry: {
  type: String,
  default: "",
},

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);