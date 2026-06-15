const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { recordView, getMyProfileViews } = require("../controllers/profileViewController");

router.post("/:profileId/view", protect, recordView);
router.get("/my-views", protect, getMyProfileViews);

module.exports = router;
