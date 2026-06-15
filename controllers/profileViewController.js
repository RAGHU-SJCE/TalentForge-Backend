const ProfileView = require("../models/ProfileView");
const User = require("../models/User");

// Record a profile view (called when someone visits a public profile)
exports.recordView = async (req, res) => {
  try {
    const { profileId } = req.params;

    // Don't track self-views
    if (profileId === req.user.id) {
      return res.status(200).json({ success: true, message: "Self view ignored" });
    }

    // Deduplicate: only one view per viewer per profile per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await ProfileView.findOne({
      viewedProfile: profileId,
      viewedBy: req.user.id,
      createdAt: { $gte: today },
    });

    if (!existing) {
      await ProfileView.create({ viewedProfile: profileId, viewedBy: req.user.id });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get who viewed your profile (last 30 days, most recent first)
exports.getMyProfileViews = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const views = await ProfileView.find({
      viewedProfile: req.user.id,
      createdAt: { $gte: thirtyDaysAgo },
    })
      .populate("viewedBy", "fullName role profilePicture designation companyName")
      .sort({ createdAt: -1 });

    // Unique viewers only (keep most recent view per person)
    const seen = new Set();
    const uniqueViews = [];
    for (const v of views) {
      const vid = v.viewedBy?._id?.toString();
      if (vid && !seen.has(vid)) {
        seen.add(vid);
        uniqueViews.push(v);
      }
    }

    res.status(200).json({
      success: true,
      totalViews: views.length,
      uniqueViewers: uniqueViews.length,
      viewers: uniqueViews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
