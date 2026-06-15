const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getPeopleYouMayKnow } = require("../controllers/suggestionsController");

router.get("/", protect, getPeopleYouMayKnow);

module.exports = router;
