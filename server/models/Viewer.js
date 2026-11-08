const mongoose = require("mongoose");

const viewerSchema = new mongoose.Schema(
  {
    viewerId: { type: String, required: true, unique: true }, // random ID generated in the browser
    displayName: { type: String, trim: true, maxlength: 50, default: "Guest" },
    email: { type: String, lowercase: true, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Viewer", viewerSchema);