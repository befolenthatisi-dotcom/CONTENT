const express = require("express");
const { likeContent, getLikes } = require("../controllers/likeController");

const router = express.Router();

router.post("/", likeContent);
router.get("/:contentId", getLikes);

module.exports = router;
