const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Content = require("../models/Content");
const Comment = require("../models/Comment");
const Like = require("../models/Like");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


const liveFilter = () => ({
  $or: [
    { status: "Published" },
    { status: "Scheduled", publishDate: { $lte: new Date() } },
  ],
});

const isLive = (c) =>
  c.status === "Published" ||
  (c.status === "Scheduled" && c.publishDate && c.publishDate <= new Date());

const FIELDS = [
  "title", "description", "category", "contentType", "thumbnailUrl",
  "mediaUrl", "articleContent", "status", "publishDate", "featured",
];

const pickFields = (body) => {
  const data = {};
  FIELDS.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f];
  });
  return data;
};

const handleError = (error, res, next) => {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ message });
  }
  next(error);
};


const getContents = async (req, res, next) => {
  try {
    const { search, category, type, featured } = req.query;
    const conditions = [liveFilter()];

    if (category && category !== "All") conditions.push({ category });
    if (type) conditions.push({ contentType: type });
    if (featured === "true") conditions.push({ featured: true });
    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      conditions.push({ $or: [{ title: rx }, { description: rx }] });
    }

    const contents = await Content.find({ $and: conditions })
      .select("-articleContent")
      .sort({ publishDate: -1 });

    res.json(contents);
  } catch (error) {
    next(error);
  }
};


const getAllContents = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const contents = await Content.find(filter).sort({ createdAt: -1 });
    res.json(contents);
  } catch (error) {
    next(error);
  }
};

const getContentById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }

    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });

    const live = isLive(content);

    
    if (!live && !req.user) {
      return res.status(404).json({ message: "Content not found" });
    }

    
    if (live && !req.user) {
      content.views += 1;
      await Content.updateOne({ _id: content._id }, { $inc: { views: 1 } });
    }

    res.json(content);
  } catch (error) {
    next(error);
  }
};


const createContent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    const content = await Content.create({
      ...pickFields(req.body),
      author: req.user._id,
    });
    res.status(201).json(content);
  } catch (error) {
    handleError(error, res, next);
  }
};


const updateContent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }

    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });

    content.set(pickFields(req.body));
    await content.save(); // runs the model validation again
    res.json(content);
  } catch (error) {
    handleError(error, res, next);
  }
};

const deleteContent = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });


    await Comment.deleteMany({ content: content._id });
    await Like.deleteMany({ content: content._id });

    res.json({ message: "Content deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContents,
  getAllContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
};