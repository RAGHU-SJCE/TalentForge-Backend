const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { toggleStar, getProjectStars, getBulkProjectStars } = require("../controllers/projectStarController");

router.post("/:projectId/star", protect, toggleStar);
router.get("/:projectId/stars", protect, getProjectStars);
router.post("/bulk-stars", protect, getBulkProjectStars);

module.exports = router;
