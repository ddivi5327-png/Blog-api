// const express = require("express");
// const User = require("../models/User");
// const Post = require("../models/post");
// const protect = require("../middleware/authMiddleware");

// const router = express.Router();

// // Add bookmark
// router.post("/:postId", protect, async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     const user = await User.findById(req.user.userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const alreadyBookmarked = user.bookmarks.some(
//       (id) => id.toString() === postId,
//     );

//     if (alreadyBookmarked) {
//       return res.status(400).json({
//         success: false,
//         message: "Post already bookmarked",
//       });
//     }

//     user.bookmarks.push(postId);

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Post bookmarked successfully",
//     });
//   } catch (error) {
//     console.error("Bookmark error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to bookmark post",
//     });
//   }
// });

// // Get my bookmarks
// router.get("/", protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate({
//       path: "bookmarks",
//       populate: {
//         path: "author",
//         select: "name email profileImage",
//       },
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       bookmarks: user.bookmarks,
//     });
//   } catch (error) {
//     console.error("Get bookmarks error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get bookmarks",
//     });
//   }
// });

// // Remove bookmark
// router.delete("/:postId", protect, async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     user.bookmarks = user.bookmarks.filter((id) => id.toString() !== postId);

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Bookmark removed successfully",
//     });
//   } catch (error) {
//     console.error("Remove bookmark error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to remove bookmark",
//     });
//   }
// });

// module.exports = router;

const express = require("express");
const User = require("../models/User");
const Post = require("../models/post");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ================================================================
// ADD BOOKMARK
// ================================================================

router.post("/:postId", protect, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyBookmarked = user.bookmarks.some(
      (id) => id.toString() === postId,
    );

    if (alreadyBookmarked) {
      return res.status(400).json({
        success: false,
        message: "Post already bookmarked",
      });
    }

    user.bookmarks.push(postId);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Post bookmarked successfully",
    });
  } catch (error) {
    console.error("Bookmark error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to bookmark post",
    });
  }
});

// ================================================================
// GET MY BOOKMARKS
// ================================================================

router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate({
      path: "bookmarks",
      populate: {
        path: "author",
        select: "name email profileImage",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get bookmarks",
    });
  }
});

// ================================================================
// REMOVE BOOKMARK
// ================================================================

router.delete("/:postId", protect, async (req, res) => {
  try {
    const { postId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== postId);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    console.error("Remove bookmark error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove bookmark",
    });
  }
});

module.exports = router;
