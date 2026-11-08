const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
const {
  createComment, getComments, getAllComments, updateComment, deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

router.post(
  "/",
  [
    body("contentId").isMongoId().withMessage("Invalid content ID"),
    body("displayName").trim().notEmpty().withMessage("Name is required").isLength({ max: 50 }),
    body("text").trim().notEmpty().withMessage("Comment cannot be empty").isLength({ max: 500 }),
  ],
  createComment
);

router.get("/admin/all", protect, getAllComments);
router.get("/:contentId", getComments);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;