const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { endorseSkill, getEndorsements, getMyEndorsements } = require("../controllers/endorsementController");

router.post("/endorse", protect, endorseSkill);
router.get("/:profileId", protect, getEndorsements);
router.get("/:profileId/mine", protect, getMyEndorsements);

module.exports = router;
