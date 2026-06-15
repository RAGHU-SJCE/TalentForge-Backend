const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to database");
    const User = require(path.join(__dirname, "models/User"));
    const users = await User.find({}, "fullName email role");
    console.log("Registered users:");
    console.log(users);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("Error connecting to database:", err);
  });
