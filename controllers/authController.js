const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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


module.exports = {
  registerUser,
  loginUser,
};