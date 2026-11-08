const Content = require("../models/Content");
const Comment = require("../models/Comment");
const Like = require("../models/Like");


const getStats = async (req, res, next) => {
  try {
    const [totalContent, published, drafts, scheduled, comments, likes, viewsAgg, popular] =
      await Promise.all([
        Content.countDocuments(),
        Content.countDocuments({ status: "Published" }),
        Content.countDocuments({ status: "Draft" }),
        Content.countDocuments({ status: "Scheduled" }),
        Comment.countDocuments(),
        Like.countDocuments(),
        Content.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
        Content.find().sort({ views: -1 }).limit(5).select("title views"),
      ]);

    res.json({
      totalContent,
      published,
      drafts,
      scheduled,
      comments,
      likes,
      views: viewsAgg[0] ? viewsAgg[0].total : 0,
      popular,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };