const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to database");
    
    const User = require("./models/User");

    // Reset password of admin@gmail.com to 123456
    let admin = await User.findOne({ email: "admin@gmail.com" });
    if (!admin) {
      console.log("Admin admin@gmail.com not found, creating new admin account...");
      admin = new User({
        fullName: "Platform Admin",
        email: "admin@gmail.com",
        role: "admin",
        password: await bcrypt.hash("123456", 10),
        location: "System Office",
        phone: "+1-800-ADMIN"
      });
      await admin.save();
    } else {
      admin.password = await bcrypt.hash("123456", 10);
      await admin.save();
      console.log("Updated admin@gmail.com password to '123456'.");
    }

    mongoose.disconnect();
    console.log("Admin seeding complete. Disconnected from database.");
  })
  .catch(err => {
    console.error("Error running seed admin script:", err);
  });
