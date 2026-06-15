const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to database");
    
    const User = require("./models/User");
    const Job = require("./models/Job");
    const Application = require("./models/Application");

    // 1. Reset recruiter@test.com password to 123456
    let recruiter = await User.findOne({ email: "recruiter@test.com" });
    if (!recruiter) {
      console.log("Recruiter recruiter@test.com not found, creating new account...");
      recruiter = new User({
        fullName: "Recruiter One",
        email: "recruiter@test.com",
        role: "recruiter",
        password: await bcrypt.hash("123456", 10),
        designation: "Talent Acquisition Manager",
        location: "New York, NY",
        phone: "+1-555-0199"
      });
      await recruiter.save();
    } else {
      recruiter.password = await bcrypt.hash("123456", 10);
      recruiter.designation = "Talent Acquisition Manager";
      recruiter.location = "New York, NY";
      recruiter.phone = "+1-555-0199";
      await recruiter.save();
      console.log("Updated recruiter@test.com password to '123456' and added basic profile details.");
    }

    // 2. Clean up existing jobs/applications for this recruiter
    await Application.deleteMany({ job: { $in: await Job.find({ recruiter: recruiter._id }).distinct("_id") } });
    await Job.deleteMany({ recruiter: recruiter._id });
    console.log("Cleaned up old jobs and applications for this recruiter.");

    // 3. Create dummy jobs
    const dummyJobs = [
      {
        title: "Senior Full Stack Engineer",
        company: "TechCorp",
        location: "New York, NY",
        salary: "$120,000 - $150,000",
        description: "We are seeking a senior full stack developer proficient in React, Node.js, and MongoDB to build state-of-the-art enterprise software products.",
        skillsRequired: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
        employmentType: "Full-time",
        experienceLevel: "Senior",
        responsibilities: ["Lead design of frontend & backend architecture", "Mentor junior developers", "Optimize database query performance"],
        benefits: ["Health insurance", "Remote working budget", "401k matching"],
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        recruiter: recruiter._id
      },
      {
        title: "Frontend Developer Intern",
        company: "TechCorp",
        location: "Remote",
        salary: "$25 - $35 / hour",
        description: "Join our dynamic agile product development team as a Frontend Developer Intern. Gain hands-on experience building pixel-perfect UI.",
        skillsRequired: ["React", "HTML5", "CSS3", "JavaScript"],
        employmentType: "Internship",
        experienceLevel: "Entry",
        responsibilities: ["Develop UI components using React", "Write tests for frontend components", "Collaborate with product designers"],
        benefits: ["Mentorship", "Flexible working hours"],
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        recruiter: recruiter._id
      },
      {
        title: "Node.js Backend Specialist",
        company: "TechCorp",
        location: "San Francisco, CA (Hybrid)",
        salary: "$100,000 - $125,000",
        description: "Seeking a backend specialist to optimize API endpoints, handle socket integrations, and configure microservices.",
        skillsRequired: ["Node.js", "Express", "WebSockets", "Redis"],
        employmentType: "Full-time",
        experienceLevel: "Mid",
        responsibilities: ["Optimize data flow APIs", "Maintain security patterns & JWT handling", "Integrate socket connections"],
        benefits: ["Stock options", "Free daily lunch", "Wellness allowance"],
        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        recruiter: recruiter._id
      }
    ];

    const insertedJobs = await Job.insertMany(dummyJobs);
    console.log(`Successfully created ${insertedJobs.length} jobs.`);

    // 4. Find some student users to create applications
    const students = await User.find({ role: "student" }).limit(4);
    if (students.length > 0) {
      const statuses = ["Applied", "Shortlisted", "Interview", "Selected"];
      const applications = [];

      students.forEach((student, index) => {
        // Apply to Senior Full Stack Engineer
        applications.push({
          student: student._id,
          job: insertedJobs[0]._id,
          resume: "https://example.com/resumes/resume_" + student.fullName.replace(/\s+/g, "_") + ".pdf",
          status: statuses[index % statuses.length]
        });

        // Also apply to Frontend Developer Intern for some
        if (index % 2 === 0) {
          applications.push({
            student: student._id,
            job: insertedJobs[1]._id,
            resume: "https://example.com/resumes/resume_" + student.fullName.replace(/\s+/g, "_") + "_intern.pdf",
            status: statuses[(index + 1) % statuses.length]
          });
        }
      });

      const insertedApps = await Application.insertMany(applications);
      console.log(`Successfully created ${insertedApps.length} job applications.`);
    } else {
      console.log("No student users found to create applications.");
    }

    mongoose.disconnect();
    console.log("Seeding complete. Disconnected from database.");
  })
  .catch(err => {
    console.error("Error running seed script:", err);
  });
