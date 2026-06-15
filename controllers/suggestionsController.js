const Connection = require("../models/Connection");
const User = require("../models/User");

// Get "People You May Know" suggestions
exports.getPeopleYouMayKnow = async (req, res) => {
  try {
    // Get all accepted connections of current user
    const myConnections = await Connection.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
      status: "accepted",
    });

    const connectedIds = myConnections.map(c =>
      c.requester.toString() === req.user.id ? c.recipient : c.requester
    );

    // Get all pending connections (sent or received) to exclude
    const pending = await Connection.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
    });
    const pendingIds = pending.flatMap(c => [c.requester.toString(), c.recipient.toString()]);

    // Exclude self, connected users, and pending
    const excludeIds = [...new Set([req.user.id, ...connectedIds.map(String), ...pendingIds])];

    const me = await User.findById(req.user.id).select("skills role");

    // Find users with matching skills or same role, not already connected
    const suggestions = await User.find({
      _id: { $nin: excludeIds },
      role: { $ne: "admin" },
      $or: [
        { skills: { $in: me.skills || [] } },
        { role: me.role },
      ],
    })
      .select("fullName role profilePicture skills designation companyName location")
      .limit(8);

    // If not enough, fill with random users
    let results = suggestions;
    if (results.length < 4) {
      const extra = await User.find({
        _id: { $nin: [...excludeIds, ...results.map(u => u._id.toString())] },
        role: { $ne: "admin" },
      })
        .select("fullName role profilePicture skills designation companyName location")
        .limit(8 - results.length);
      results = [...results, ...extra];
    }

    res.status(200).json({ success: true, suggestions: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
