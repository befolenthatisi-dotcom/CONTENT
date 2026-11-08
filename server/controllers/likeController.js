const mongoose = require("mongoose");
const Like = require("../models/Like");
const Content = require("../models/Content");


const likeContent = async (req, res, next) => {
  try {
    const { contentId, viewerId } = req.body;
    if (!mongoose.isValidObjectId(contentId) || !viewerId) {
      return res.status(400).json({ message: "contentId and viewerId are required" });
    }
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: "Content not found" });

    const existing = await Like.findOne({ content: contentId, viewerId });
    if (!existing) await Like.create({ content: contentId, viewerId });

    const count = await Like.countDocuments({ content: contentId });
    res.status(existing ? 200 : 201).json({ count, liked: true });
  } catch (error) {
    next(error);
  }
};


const getLikes = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    if (!mongoose.isValidObjectId(contentId)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }
    const count = await Like.countDocuments({ content: contentId });
    const liked = req.query.viewerId
      ? !!(await Like.findOne({ content: contentId, viewerId: req.query.viewerId }))
      : false;
    res.json({ count, liked });
  } catch (error) {
    next(error);
  }
};

module.exports = { likeContent, getLikes };
