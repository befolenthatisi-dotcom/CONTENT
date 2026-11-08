const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 150 },
    description: { type: String, required: [true, "Description is required"], trim: true },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Education", "Technology", "Entertainment", "Lifestyle", "Business", "Other"],
    },
    contentType: {
      type: String,
      required: [true, "Content type is required"],
      enum: ["video", "article", "image", "podcast"],
    },
    thumbnailUrl: { type: String, default: "" },
    mediaUrl: { type: String, default: "" },
    articleContent: { type: String, default: "" },
    status: { type: String, enum: ["Draft", "Published", "Scheduled"], default: "Draft" },
    publishDate: { type: Date },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } // createdAt = "Date created"
);


contentSchema.pre("validate", function () {
  if (!this.mediaUrl && !this.articleContent) {
    this.invalidate("mediaUrl", "Provide a media URL or article content");
  }
  if (this.status === "Scheduled" && !this.publishDate) {
    this.invalidate("publishDate", "Scheduled content needs a publication date");
  }
  if (this.status === "Published" && !this.publishDate) {
    this.publishDate = new Date();
  }
});

module.exports = mongoose.model("Content", contentSchema);