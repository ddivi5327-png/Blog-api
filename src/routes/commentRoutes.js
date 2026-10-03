const express = require("express");

const {
  createComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all comments for a post
router.get("/post/:postId", getComments);

// Create a comment
router.post("/post/:postId", protect, createComment);

// Delete your own comment
router.delete("/:id", protect, deleteComment);

module.exports = router;
