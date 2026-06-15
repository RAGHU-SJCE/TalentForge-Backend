const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to database");
    const User = require(path.join(__dirname, "models/User"));
    
    // Let's reset the password of recruiter@gmail.com to 123456789
    const user = await User.findOne({ email: "recruiter@gmail.com" });
    if (user) {
      user.password = await bcrypt.hash("123456789", 10);
      await user.save();
      console.log("Password reset successfully for recruiter@gmail.com to '123456789'");
    } else {
      console.log("User recruiter@gmail.com not found!");
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    print("Error:", err);
  });
