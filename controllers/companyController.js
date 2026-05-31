const User = require("../models/User");


// Update Company Profile
const updateCompanyProfile = async (
  req,
  res
) => {
  try {
    const recruiter =
      await User.findById(req.user.id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    recruiter.companyName =
      req.body.companyName ||
      recruiter.companyName;

    recruiter.companyWebsite =
      req.body.companyWebsite ||
      recruiter.companyWebsite;

    recruiter.companyDescription =
      req.body.companyDescription ||
      recruiter.companyDescription;

    recruiter.companyLogo =
      req.body.companyLogo ||
      recruiter.companyLogo;

    recruiter.industry =
      req.body.industry ||
      recruiter.industry;

    await recruiter.save();

    res.status(200).json({
      success: true,
      message:
        "Company profile updated",
      recruiter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get My Company Profile
const getMyCompanyProfile =
  async (req, res) => {
    try {
      const recruiter =
        await User.findById(
          req.user.id
        ).select("-password");

      res.status(200).json({
        success: true,
        recruiter,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// Public Company Profile
const getCompanyById =
  async (req, res) => {
    try {
      const recruiter =
        await User.findById(
          req.params.id
        ).select(
          "companyName companyWebsite companyDescription companyLogo industry"
        );

      if (!recruiter) {
        return res.status(404).json({
          success: false,
          message:
            "Company not found",
        });
      }

      res.status(200).json({
        success: true,
        recruiter,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  updateCompanyProfile,
  getMyCompanyProfile,
  getCompanyById,
};