const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


// =====================================
// Register User
// =====================================
const registerUser = async (
  req,
  res
) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all required fields",
      });
    }

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists",
      });
    }

    const allowedRoles = [
      "student",
      "professional",
      "recruiter",
    ];

    const userRole =
      allowedRoles.includes(role)
        ? role
        : "student";

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        fullName,
        email,
        password:
          hashedPassword,
        role: userRole,
      });

    sendEmail({
      to: user.email,
      subject:
        "Welcome to TalentForge",
      html: `
        <h2>Welcome ${user.fullName} 🎉</h2>

        <p>Your TalentForge account has been created successfully.</p>

        <p><strong>Role:</strong> ${user.role}</p>

        <br>

        <p>Start exploring jobs, projects, and opportunities.</p>

        <p>Thank you for joining TalentForge.</p>
      `,
    }).catch((err) =>
      console.log(
        "Email Error:",
        err.message
      )
    );

    res.status(201).json({
      success: true,
      message:
        "User Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


// =====================================
// Login User
// =====================================
const loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Login Successful",
      token,
      user: {
        id: user._id,
        fullName:
          user.fullName,
        email:
          user.email,
        role:
          user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


// =====================================
// Forgot Password
// =====================================
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Frontend URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link is valid for 10 minutes.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: message,
      });

      res.status(200).json({ success: true, message: "Email sent" });
    } catch (error) {
      console.error("Forgot password email send error:", error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ success: false, message: `Email could not be sent. Error: ${error.message}` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// Reset Password
// =====================================
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Set new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};