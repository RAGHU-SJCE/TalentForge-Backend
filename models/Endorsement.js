const mongoose = require("mongoose");

const endorsementSchema = new mongoose.Schema(
  {
    profileOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    endorsedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skill: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// One endorsement per skill per user pair
endorsementSchema.index({ profileOwner: 1, endorsedBy: 1, skill: 1 }, { unique: true });

module.exports = mongoose.model("Endorsement", endorsementSchema);
