const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const Content = require("../models/Content");

const isLive = (c) =>
  c.status === "Published" ||
  (c.status === "Scheduled" && c.publishDate && c.publishDate <= new Date());


const createComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    const { contentId, displayName, text } = req.body;

    const content = await Content.findById(contentId);
    if (!content || !isLive(content)) {
      return res.status(404).json({ message: "Content not found" });
    }

    const comment = await Comment.create({ content: contentId, displayName, text });
    res.status(201).json(comment);
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return res.status(400).json({ message });
    }
    next(error);
  }
};


const getComments = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.contentId)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }
    const comments = await Comment.find({
      content: req.params.contentId,
      status: "approved",
    }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    next(error);
  }
};


const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find()
      .populate("content", "title")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "hidden"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  } catch (error) {
    next(error);
  }
};


const deleteComment = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createComment, getComments, getAllComments, updateComment, deleteComment };