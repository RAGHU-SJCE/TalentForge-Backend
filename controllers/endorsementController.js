const Endorsement = require("../models/Endorsement");
const Connection = require("../models/Connection");

// Endorse a skill on someone's profile (must be a connection)
exports.endorseSkill = async (req, res) => {
  try {
    const { profileId, skill } = req.body;

    if (profileId === req.user.id) {
      return res.status(400).json({ success: false, message: "Cannot endorse your own skills" });
    }

    // Check they are connected
    const connection = await Connection.findOne({
      $or: [
        { requester: req.user.id, recipient: profileId, status: "accepted" },
        { requester: profileId, recipient: req.user.id, status: "accepted" },
      ],
    });

    if (!connection) {
      return res.status(403).json({ success: false, message: "You must be connected to endorse skills" });
    }

    // Upsert endorsement
    const existing = await Endorsement.findOne({
      profileOwner: profileId,
      endorsedBy: req.user.id,
      skill,
    });

    if (existing) {
      // Toggle: remove endorsement if already endorsed
      await existing.deleteOne();
      return res.status(200).json({ success: true, endorsed: false, message: "Endorsement removed" });
    }

    await Endorsement.create({ profileOwner: profileId, endorsedBy: req.user.id, skill });
    res.status(201).json({ success: true, endorsed: true, message: "Skill endorsed!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all endorsements for a profile, grouped by skill
exports.getEndorsements = async (req, res) => {
  try {
    const { profileId } = req.params;

    const endorsements = await Endorsement.find({ profileOwner: profileId })
      .populate("endorsedBy", "fullName profilePicture role");

    // Group by skill
    const grouped = {};
    for (const e of endorsements) {
      if (!grouped[e.skill]) grouped[e.skill] = { skill: e.skill, count: 0, endorsers: [] };
      grouped[e.skill].count++;
      grouped[e.skill].endorsers.push(e.endorsedBy);
    }

    res.status(200).json({ success: true, endorsements: Object.values(grouped) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get which skills the current user has already endorsed for a profile
exports.getMyEndorsements = async (req, res) => {
  try {
    const { profileId } = req.params;
    const endorsed = await Endorsement.find({ profileOwner: profileId, endorsedBy: req.user.id });
    res.status(200).json({ success: true, endorsedSkills: endorsed.map(e => e.skill) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
