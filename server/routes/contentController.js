const express = require("express");
const { body } = require("express-validator");
const { protect, optionalAuth } = require("../middleware/auth");
const {
  getContents,
  getAllContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");

const router = express.Router();

const CATEGORIES = ["Education", "Technology", "Entertainment", "Lifestyle", "Business", "Other"];
const TYPES = ["video", "article", "image", "podcast"];
const STATUSES = ["Draft", "Published", "Scheduled"];

// required = true for create, false for update (only checks fields that are sent)
const rules = (required) => {
  const field = (name) => {
    const chain = body(name);
    return required ? chain : chain.optional();
  };
  return [
    field("title").trim().notEmpty().withMessage("Title is required"),
    field("description").trim().notEmpty().withMessage("Description is required"),
    field("category").isIn(CATEGORIES).withMessage("Invalid category"),
    field("contentType").isIn(TYPES).withMessage("Invalid content type"),
    body("status").optional().isIn(STATUSES).withMessage("Invalid status"),
    body("publishDate").optional({ values: "falsy" }).isISO8601().withMessage("Invalid publication date"),
  ];
};

// Public
router.get("/", getContents);

// Creator only (must come before "/:id")
router.get("/admin/all", protect, getAllContents);

router.get("/:id", optionalAuth, getContentById);

// Creator only
router.post("/", protect, rules(true), createContent);
router.put("/:id", protect, rules(false), updateContent);
router.delete("/:id", protect, deleteContent);

module.exports = router;