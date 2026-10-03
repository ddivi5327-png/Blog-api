// const express = require("express");

// const { createPost, getPosts } = require("../controllers/postController");

// const protect = require("../middleware/authMiddleware");

// const router = express.Router();

// router.get("/", getPosts);

// router.post("/", protect, createPost);

// module.exports = router;
// const express = require("express");

// const {
//   createPost,
//   getPosts,
//   getPostById,
//   updatePost,
//   deletePost,
// } = require("../controllers/postController");

// const protect = require("../middleware/authMiddleware");
// const upload = require("../middleware/uploadMiddleware");

// const router = express.Router();

// router.get("/", getPosts);
// router.get("/:id", getPostById);
// router.put("/:id", protect, updatePost);
// router.delete("/:id", protect, deletePost);
// router.post("/", protect, upload.single("image"), createPost);

// module.exports = router;

// const express = require("express");

// const {
//   createPost,
//   getPosts,
//   getPostById,
//   updatePost,
//   deletePost,
// } = require("../controllers/postController");

// const protect = require("../middleware/authMiddleware");
// const upload = require("../middleware/uploadMiddleware");

// const router = express.Router();

// // Get all posts
// router.get("/", getPosts);

// // Get single post
// router.get("/:id", getPostById);

// // Update post
// // Supports title/body + optional image upload
// router.put("/:id", protect, upload.single("image"), updatePost);

// // Delete post
// router.delete("/:id", protect, deletePost);

// // Create post
// router.post("/", protect, upload.single("image"), createPost);

// module.exports = router;

// const Comment = require("../models/comment");
// const Post = require("../models/post");
// const cloudinary = require("../config/cloudinary");

// /* ================================================================ */
// /* CREATE POST                                                       */
// /* ================================================================ */

// const createPost = async (req, res) => {
//   try {
//     const { title, body, imageWidth, imageHeight } = req.body;

//     if (!title || !body) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and body are required",
//       });
//     }

//     let imageUrl = "";

//     if (req.file) {
//       const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: "blog-posts",
//             resource_type: "image",
//           },
//           (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result);
//             }
//           },
//         );

//         uploadStream.end(req.file.buffer);
//       });

//       imageUrl = result.secure_url;
//     }

//     const post = await Post.create({
//       title,
//       body,
//       image: imageUrl,
//       imageWidth: imageWidth ? Number(imageWidth) : null,
//       imageHeight: imageHeight ? Number(imageHeight) : null,
//       author: req.user.userId,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post,
//     });
//   } catch (error) {
//     console.error("Create post error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Post creation failed",
//     });
//   }
// };

// /* ================================================================ */
// /* GET POSTS                                                         */
// /* ================================================================ */

// const getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find().populate("author", "name email").sort({
//       createdAt: -1,
//     });

//     const postsWithCommentCount = await Promise.all(
//       posts.map(async (post) => {
//         const commentCount = await Comment.countDocuments({
//           post: post._id,
//         });

//         return {
//           ...post.toObject(),
//           commentCount,
//         };
//       }),
//     );

//     res.status(200).json({
//       success: true,
//       posts: postsWithCommentCount,
//     });
//   } catch (error) {
//     console.error("Get posts error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch posts",
//     });
//   }
// };

// /* ================================================================ */
// /* GET SINGLE POST                                                   */
// /* ================================================================ */

// const getPostById = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id).populate(
//       "author",
//       "name email",
//     );

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       post,
//     });
//   } catch (error) {
//     console.error("Get post error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch post",
//     });
//   }
// };

// /* ================================================================ */
// /* UPDATE POST                                                        */
// /* ================================================================ */

// const updatePost = async (req, res) => {
//   try {
//     const { title, body, imageWidth, imageHeight, removeImage } = req.body;

//     if (!title || !body) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and body are required",
//       });
//     }

//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     /* Check post ownership */
//     if (post.author.toString() !== req.user.userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "You can only edit your own post",
//       });
//     }

//     /* Update text */
//     post.title = title;
//     post.body = body;

//     /* ------------------------------------------------------------ */
//     /* Remove existing image                                        */
//     /* ------------------------------------------------------------ */

//     if (removeImage === "true") {
//       post.image = "";
//       post.imageWidth = null;
//       post.imageHeight = null;
//     }

//     /* ------------------------------------------------------------ */
//     /* Upload new image                                             */
//     /* ------------------------------------------------------------ */

//     if (req.file) {
//       const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: "blog-posts",
//             resource_type: "image",
//           },
//           (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result);
//             }
//           },
//         );

//         uploadStream.end(req.file.buffer);
//       });

//       post.image = result.secure_url;

//       post.imageWidth = imageWidth ? Number(imageWidth) : null;

//       post.imageHeight = imageHeight ? Number(imageHeight) : null;
//     }

//     await post.save();

//     const updatedPost = await Post.findById(post._id).populate(
//       "author",
//       "name email",
//     );

//     res.status(200).json({
//       success: true,
//       message: "Post updated successfully",
//       post: updatedPost,
//     });
//   } catch (error) {
//     console.error("Update post error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to update post",
//     });
//   }
// };

// /* ================================================================ */
// /* DELETE POST                                                        */
// /* ================================================================ */

// const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     /* Check post ownership */
//     if (post.author.toString() !== req.user.userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "You can only delete your own post",
//       });
//     }

//     await Post.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: "Post deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete post error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to delete post",
//     });
//   }
// };

// /* ================================================================ */
// /* EXPORTS                                                            */
// /* ================================================================ */

// module.exports = {
//   createPost,
//   getPosts,
//   getPostById,
//   updatePost,
//   deletePost,
// };

const express = require("express");

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getPosts);

router.get("/:id", getPostById);

router.put("/:id", protect, upload.single("image"), updatePost);

router.delete("/:id", protect, deletePost);

router.post("/", protect, upload.single("image"), createPost);

module.exports = router;
