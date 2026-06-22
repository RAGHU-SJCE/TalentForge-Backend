const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load .env configuration
dotenv.config({ path: path.join(__dirname, ".env") });

const User = require("./models/User");
const Project = require("./models/Project");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env");
  process.exit(1);
}

const seed = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const hashedPassword = await bcrypt.hash("123456", 10);

    // 1. Seed raghu@gmail.com (Student)
    let raghuUser = await User.findOne({ email: "raghu@gmail.com" });
    const raghuDetails = {
      fullName: "Raghavendra S (Student)",
      email: "raghu@gmail.com",
      password: hashedPassword,
      role: "student",
      skills: ["React.js", "Node.js", "MongoDB", "Express.js", "JavaScript", "HTML/CSS"],
      bio: "Aspiring software engineer specializing in MERN stack web applications and clean code development.",
      location: "Mysuru, Karnataka, India",
      phone: "+91 9876543210",
      education: "B.E. in Information Science and Engineering, JSS Science and Technology University",
      experience: "MERN Stack Developer intern at WebTech Solutions",
    };

    if (raghuUser) {
      console.log("Found existing user raghu@gmail.com. Updating details...");
      Object.assign(raghuUser, raghuDetails);
      await raghuUser.save();
    } else {
      console.log("Creating user raghu@gmail.com...");
      raghuUser = await User.create(raghuDetails);
    }
    console.log("raghu@gmail.com seeded successfully.");

    // 2. Seed professional@gmail.com (Professional)
    let profUser = await User.findOne({ email: "professional@gmail.com" });
    const profDetails = {
      fullName: "Raghu Professional",
      email: "professional@gmail.com",
      password: hashedPassword,
      role: "professional",
      skills: ["Node.js", "Express.js", "MongoDB", "AWS", "Docker", "Git", "Redis"],
      bio: "Senior software engineer with 4+ years of experience building scalable backend architectures and API interfaces.",
      location: "Mysuru, Karnataka, India",
      phone: "+91 9998887776",
      designation: "Senior Backend Developer",
      companyName: "TechSolutions Inc.",
      experience: "4 Years as Senior Developer",
      education: "M.Tech in Computer Science & Engineering",
    };

    if (profUser) {
      console.log("Found existing user professional@gmail.com. Updating details...");
      Object.assign(profUser, profDetails);
      await profUser.save();
    } else {
      console.log("Creating user professional@gmail.com...");
      profUser = await User.create(profDetails);
    }
    console.log("professional@gmail.com seeded successfully.");

    // 3. Clear existing projects for these two users and seed new ones
    console.log("Clearing projects for seeded users...");
    await Project.deleteMany({ createdBy: { $in: [raghuUser._id, profUser._id] } });

    console.log("Seeding projects...");
    const mockProjects = [
      {
        title: "TalentForge Platform",
        description: "A career networking and portfolio showcase platform for students, professionals, and recruiters.",
        technologies: ["React.js", "Node.js", "Express", "MongoDB"],
        githubLink: "https://github.com/raghu/TalentForge",
        createdBy: raghuUser._id,
      },
      {
        title: "E-Commerce Smart Analytics",
        description: "An intelligence analytical dashboard tracking real-time purchase funnels and customer actions.",
        technologies: ["React", "Redux Toolkit", "D3.js", "Node.js"],
        githubLink: "https://github.com/raghu/ecommerce-analytics",
        createdBy: raghuUser._id,
      },
      {
        title: "Distributed Task Queue",
        description: "A high-throughput distributed message processing library backed by Redis caching.",
        technologies: ["Node.js", "Redis", "Docker"],
        githubLink: "https://github.com/professional/task-queue",
        createdBy: profUser._id,
      },
      {
        title: "API Gateway Engine",
        description: "A microservices gateway handling token caching, request rate limiting, and route security policies.",
        technologies: ["Express", "Redis", "JWT"],
        githubLink: "https://github.com/professional/api-gateway",
        createdBy: profUser._id,
      },
    ];

    await Project.insertMany(mockProjects);
    console.log("Projects seeded successfully.");

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
