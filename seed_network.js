const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to database");
    
    const User = require("./models/User");
    const Connection = require("./models/Connection");

    // 1. Reset password of raghu@gmail.com to 123456
    let raghu = await User.findOne({ email: "raghu@gmail.com" });
    if (!raghu) {
      console.log("User raghu@gmail.com not found, creating new account...");
      raghu = new User({
        fullName: "Raghavendra s",
        email: "raghu@gmail.com",
        role: "student",
        password: await bcrypt.hash("123456", 10),
        location: "Bengaluru, India",
        phone: "+91-9876543210"
      });
      await raghu.save();
    } else {
      raghu.password = await bcrypt.hash("123456", 10);
      await raghu.save();
      console.log("Updated raghu@gmail.com password to '123456'.");
    }

    // 2. Clean up existing connections for raghu
    await Connection.deleteMany({
      $or: [
        { requester: raghu._id },
        { recipient: raghu._id }
      ]
    });
    console.log("Cleaned up old connections for Raghu.");

    // 3. Find other users to create network connections
    const otherUsers = await User.find({ _id: { $ne: raghu._id } });
    console.log(`Found ${otherUsers.length} other users in DB.`);

    const connections = [];

    // Let's create accepted connections with the first 8 users
    const acceptedCount = Math.min(otherUsers.length, 8);
    for (let i = 0; i < acceptedCount; i++) {
      // Alternate who is requester vs recipient to make it look organic
      if (i % 2 === 0) {
        connections.push({
          requester: raghu._id,
          recipient: otherUsers[i]._id,
          status: "accepted"
        });
      } else {
        connections.push({
          requester: otherUsers[i]._id,
          recipient: raghu._id,
          status: "accepted"
        });
      }
    }

    // Let's create pending requests for the next 3 users
    const pendingCount = Math.min(otherUsers.length - acceptedCount, 3);
    for (let i = 0; i < pendingCount; i++) {
      const targetUser = otherUsers[acceptedCount + i];
      // Create incoming connection requests (requester is the other user, recipient is Raghu)
      connections.push({
        requester: targetUser._id,
        recipient: raghu._id,
        status: "pending"
      });
    }

    if (connections.length > 0) {
      const inserted = await Connection.insertMany(connections);
      console.log(`Successfully seeded ${inserted.length} connections for Raghu (accepted & pending).`);
    } else {
      console.log("No other users found to create connections.");
    }

    mongoose.disconnect();
    console.log("Network seeding complete. Disconnected from database.");
  })
  .catch(err => {
    console.error("Error running seed network script:", err);
  });
