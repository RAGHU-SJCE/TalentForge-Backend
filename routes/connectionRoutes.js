const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getNetwork,
  getConnectionStatus,
  removeConnection,
  withdrawRequest,
  getSentRequests,
  searchUsers,
} = require("../controllers/connectionController");

router.post("/request", protect, sendRequest);
router.put("/request/:id/accept", protect, acceptRequest);
router.put("/request/:id/reject", protect, rejectRequest);
router.delete("/request/:id/withdraw", protect, withdrawRequest);
router.delete("/:id/remove", protect, removeConnection);
router.get("/sent", protect, getSentRequests);
router.get("/network", protect, getNetwork);
router.get("/status/:userId", protect, getConnectionStatus);
router.get("/search", protect, searchUsers);

module.exports = router;
