const Connection = require("../models/Connection");
const User = require("../models/User");

// Send a connection request
exports.sendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    
    if (req.user.id === recipientId) {
      return res.status(400).json({ success: false, message: "Cannot connect with yourself" });
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { requester: req.user.id, recipient: recipientId },
        { requester: recipientId, recipient: req.user.id },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ success: false, message: "Connection already exists or is pending" });
    }

    const connection = await Connection.create({
      requester: req.user.id,
      recipient: recipientId,
    });

    res.status(201).json({ success: true, connection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Accept a connection request
exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params; // connection id
    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ success: false, message: "Connection request not found" });
    }

    if (connection.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to accept this request" });
    }

    connection.status = "accepted";
    await connection.save();

    res.status(200).json({ success: true, connection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject a connection request
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params; // connection id
    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ success: false, message: "Connection request not found" });
    }

    if (connection.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to reject this request" });
    }

    connection.status = "rejected";
    await connection.save();

    res.status(200).json({ success: true, connection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all connections (accepted) and pending requests
exports.getNetwork = async (req, res) => {
  try {
    // Pending requests sent TO the user
    const pendingRequests = await Connection.find({
      recipient: req.user.id,
      status: "pending"
    }).populate("requester", "fullName email role");

    // Accepted connections
    const connections = await Connection.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
      status: "accepted"
    }).populate("requester recipient", "fullName email role");

    res.status(200).json({
      success: true,
      pendingRequests,
      connections
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check connection status between current user and another user
exports.getConnectionStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const connection = await Connection.findOne({
      $or: [
        { requester: req.user.id, recipient: userId },
        { requester: userId, recipient: req.user.id },
      ],
    });

    res.status(200).json({ success: true, connection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove an accepted connection
exports.removeConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await Connection.findById(id);
    if (!connection) return res.status(404).json({ success: false, message: "Connection not found" });
    const isParty = connection.requester.toString() === req.user.id || connection.recipient.toString() === req.user.id;
    if (!isParty) return res.status(403).json({ success: false, message: "Not authorized" });
    await connection.deleteOne();
    res.status(200).json({ success: true, message: "Connection removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Withdraw a pending sent request
exports.withdrawRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await Connection.findById(id);
    if (!connection) return res.status(404).json({ success: false, message: "Request not found" });
    if (connection.requester.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
    await connection.deleteOne();
    res.status(200).json({ success: true, message: "Request withdrawn" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get sent pending requests
exports.getSentRequests = async (req, res) => {
  try {
    const sentRequests = await Connection.find({ requester: req.user.id, status: "pending" })
      .populate("recipient", "fullName email role");
    res.status(200).json({ success: true, sentRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search all users
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ success: true, users: [] });
    const users = await User.find({
      _id: { $ne: req.user.id },
      $or: [
        { fullName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { skills: { $in: [new RegExp(q, "i")] } },
        { companyName: { $regex: q, $options: "i" } },
      ]
    }).select("fullName email role skills companyName profilePicture designation").limit(10);
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

