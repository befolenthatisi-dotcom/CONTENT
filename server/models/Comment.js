const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
    displayName: { type: String, required: [true, "Display name is required"], trim: true, maxlength: 50 },
    text: { type: String, required: [true, "Comment cannot be empty"], trim: true, maxlength: 500 },
    status: { type: String, enum: ["pending", "approved", "hidden"], default: "approved" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);