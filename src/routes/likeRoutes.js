const express = require("express");

const { toggleLike, getLikeInfo } = require("../controllers/likeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Like / Unlike a post
router.post("/:postId", protect, toggleLike);

// Get like count and current user's like status
router.get("/:postId", protect, getLikeInfo);

module.exports = router;
