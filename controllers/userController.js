const User = require("../models/User");

// =====================================
// Get Profile
// =====================================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Upload Resume
// =====================================
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload a resume",
      });
    }

    const resumePath =
      "/uploads/resumes/" +
      req.file.filename;

    const user =
      await User.findByIdAndUpdate(
        req.user.id,
        {
          resume: resumePath,
        },
        {
          new: true,
        }
      ).select("-password");

    res.status(200).json({
      success: true,
      message:
        "Resume uploaded successfully",
      resume: user.resume,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Upload Profile Picture
// =====================================
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an image" });
    }
    const picturePath = "/uploads/profile-pictures/" + req.file.filename;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: picturePath },
      { new: true }
    ).select("-password");
    res.status(200).json({ success: true, message: "Profile picture updated", profilePicture: user.profilePicture, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// =====================================
// Update Skills
// =====================================
const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    const user =
      await User.findByIdAndUpdate(
        req.user.id,
        {
          skills,
        },
        {
          new: true,
        }
      ).select("-password");

    res.status(200).json({
      success: true,
      message:
        "Skills Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Update Bio
// =====================================
const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;

    const user =
      await User.findByIdAndUpdate(
        req.user.id,
        {
          bio,
        },
        {
          new: true,
        }
      ).select("-password");

    res.status(200).json({
      success: true,
      message:
        "Bio Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Update Experience
// =====================================
const updateExperience = async (req, res) => {
  try {
    const { experience } = req.body;

    const user =
      await User.findByIdAndUpdate(
        req.user.id,
        {
          experience,
        },
        {
          new: true,
        }
      ).select("-password");

    res.status(200).json({
      success: true,
      message:
        "Experience Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Update Company Details (For Recruiters)
// =====================================
const updateCompanyDetails = async (req, res) => {
  try {
    const { companyName, designation, companyWebsite, companyDescription, industry } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (companyName !== undefined) user.companyName = companyName;
    if (designation !== undefined) user.designation = designation;
    if (companyWebsite !== undefined) user.companyWebsite = companyWebsite;
    if (companyDescription !== undefined) user.companyDescription = companyDescription;
    if (industry !== undefined) user.industry = industry;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Company Details Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Update Advanced Profile Fields
// =====================================
const updateAdvancedProfile = async (req, res) => {
  try {
    const { 
      dateOfBirth, location, phone, linkedinUrl, portfolioUrl, 
      education, certifications, designation,
      skills, bio, experience, companyName, companyWebsite, companyDescription, industry
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;
    if (education !== undefined) user.education = education;
    if (certifications !== undefined) user.certifications = certifications;
    if (designation !== undefined) user.designation = designation;
    
    // Add existing fields
    if (skills !== undefined) user.skills = skills;
    if (bio !== undefined) user.bio = bio;
    if (experience !== undefined) user.experience = experience;
    if (companyName !== undefined) user.companyName = companyName;
    if (companyWebsite !== undefined) user.companyWebsite = companyWebsite;
    if (companyDescription !== undefined) user.companyDescription = companyDescription;
    if (industry !== undefined) user.industry = industry;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get All Students (Advanced Search)
// =====================================
const getAllStudents = async (req, res) => {
  try {
    const { skill, name, project } = req.query;

    let filter = {
      role: "student",
    };

    if (name) {
      filter.fullName = { $regex: name, $options: "i" };
    }

    if (skill) {
      filter.skills = { $regex: skill, $options: "i" };
    }

    if (project) {
      const Project = require("../models/Project");
      const matchedProjects = await Project.find({
        $or: [
          { title: { $regex: project, $options: "i" } },
          { technologies: { $regex: project, $options: "i" } }
        ]
      });
      const userIds = matchedProjects.map((p) => p.createdBy);
      
      // If we already have a filter._id (not likely here, but safe practice), we'd intersect.
      // Since we don't, just set it.
      filter._id = { $in: userIds };
    }

    const students = await User.find(filter).select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get Student By ID
// =====================================
const getStudentById = async (
  req,
  res
) => {
  try {
    const student =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get Public Profile
// =====================================
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -resetPasswordToken -resetPasswordExpire");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const Project = require("../models/Project");
    const projects = await Project.find({ createdBy: user._id }).sort("-createdAt");

    res.status(200).json({
      success: true,
      user,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  uploadResume,
  uploadProfilePicture,
  updateSkills,
  updateBio,
  updateExperience,
  updateCompanyDetails,
  getAllStudents,
  getStudentById,
  getPublicProfile,
  updateAdvancedProfile,
};