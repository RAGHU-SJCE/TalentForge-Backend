const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getConversation,
  sendMessage,
  getChatContacts,
} = require("../controllers/messageController");

router.get("/contacts", protect, getChatContacts);
router.get("/:userId", protect, getConversation);
router.post("/", protect, sendMessage);

module.exports = router;
