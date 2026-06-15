const Message = require("../models/Message");
const User = require("../models/User");
const { getIO, getUserSocket } = require("../socket");

// Get conversation history with a specific user
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    }).sort("createdAt");

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send a message via REST (Socket is used for real-time, but REST can be fallback or initial post)
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    const receiverSocket = getUserSocket(receiverId);
    if (receiverSocket) {
      getIO().to(receiverSocket).emit("receive_message", message);
    }

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get list of users the current user has chatted with
exports.getChatContacts = async (req, res) => {
  try {
    // Find all messages involving the current user
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    }).sort("-createdAt");

    const contactsMap = new Map();

    for (let msg of messages) {
      const otherUserId = msg.sender.toString() === req.user.id ? msg.receiver.toString() : msg.sender.toString();
      
      if (!contactsMap.has(otherUserId)) {
        const user = await User.findById(otherUserId).select("fullName role");
        if (user) {
          contactsMap.set(otherUserId, {
            _id: user._id,
            fullName: user.fullName,
            role: user.role,
            lastMessage: msg.content,
            lastMessageTime: msg.createdAt
          });
        }
      }
    }

    const contacts = Array.from(contactsMap.values());
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
