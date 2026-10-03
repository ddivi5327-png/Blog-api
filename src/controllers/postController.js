// const Comment = require("../models/comment");
// const Post = require("../models/post");
// const cloudinary = require("../config/cloudinary");

// /* ================================================================ */
// /* CREATE POST                                                       */
// /* ================================================================ */

// const createPost = async (req, res) => {
//   try {
//     const { title, body, category, imageWidth, imageHeight } = req.body;

//     if (!title || !body || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "Title, body and category are required",
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
//       category,
//       image: imageUrl,
//       imageWidth: imageWidth ? Number(imageWidth) : null,
//       imageHeight: imageHeight ? Number(imageHeight) : null,
//       author: req.user.userId,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post,
//     });
//   } catch (error) {
//     console.error("Create post error:", error);

//     return res.status(500).json({
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
//     const posts = await Post.find()
//       .populate("author", "name email profileImage")
//       .sort({
//         createdAt: -1,
//       });

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

//     return res.status(200).json({
//       success: true,
//       posts: postsWithCommentCount,
//     });
//   } catch (error) {
//     console.error("Get posts error:", error);

//     return res.status(500).json({
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
//       "name email profileImage",
//     );

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       post,
//     });
//   } catch (error) {
//     console.error("Get post error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch post",
//     });
//   }
// };

// /* ================================================================ */
// /* UPDATE POST                                                       */
// /* ================================================================ */

// const updatePost = async (req, res) => {
//   try {
//     /* ------------------------------------------------------------ */
//     /* DEBUG INFORMATION                                            */
//     /* ------------------------------------------------------------ */

//     console.log("");
//     console.log("================ EDIT POST REQUEST ================");

//     console.log("POST ID:", req.params.id);

//     console.log("USER:", req.user);

//     console.log("BODY:", req.body);

//     console.log("FILE:", req.file);

//     console.log("====================================================");

//     /* ------------------------------------------------------------ */
//     /* READ REQUEST DATA                                            */
//     /* ------------------------------------------------------------ */

//     const { title, body, category, imageWidth, imageHeight, removeImage } =
//       req.body;

//     /* ------------------------------------------------------------ */
//     /* VALIDATE                                                      */
//     /* ------------------------------------------------------------ */

//     if (!title || !body || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "Title, body and category are required",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* FIND POST                                                     */
//     /* ------------------------------------------------------------ */

//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       console.log("EDIT POST ERROR: Post not found");

//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CHECK USER                                                    */
//     /* ------------------------------------------------------------ */

//     if (!req.user) {
//       console.log("EDIT POST ERROR: User not found in request");

//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CHECK OWNERSHIP                                               */
//     /* ------------------------------------------------------------ */

//     if (post.author.toString() !== req.user.userId.toString()) {
//       console.log("EDIT POST ERROR: User is not the post owner");

//       console.log("POST AUTHOR:", post.author.toString());

//       console.log("CURRENT USER:", req.user.userId.toString());

//       return res.status(403).json({
//         success: false,
//         message: "You can only edit your own post",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* UPDATE TEXT AND CATEGORY                                      */
//     /* ------------------------------------------------------------ */

//     post.title = title;
//     post.body = body;
//     post.category = category;

//     /* ------------------------------------------------------------ */
//     /* REMOVE IMAGE                                                  */
//     /* ------------------------------------------------------------ */

//     if (removeImage === "true") {
//       console.log("Removing existing image");

//       post.image = "";
//       post.imageWidth = null;
//       post.imageHeight = null;
//     }

//     /* ------------------------------------------------------------ */
//     /* UPLOAD NEW IMAGE                                              */
//     /* ------------------------------------------------------------ */

//     if (req.file) {
//       console.log("New image received:", req.file.originalname);

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

//       console.log("Cloudinary image URL:", post.image);
//     }

//     /* ------------------------------------------------------------ */
//     /* SAVE                                                          */
//     /* ------------------------------------------------------------ */

//     await post.save();

//     console.log("Post saved successfully:", post._id.toString());

//     /* ------------------------------------------------------------ */
//     /* GET UPDATED POST                                              */
//     /* ------------------------------------------------------------ */

//     const updatedPost = await Post.findById(post._id).populate(
//       "author",
//       "name email profileImage",
//     );

//     console.log("================ EDIT POST SUCCESS ================");

//     console.log("");

//     return res.status(200).json({
//       success: true,
//       message: "Post updated successfully",
//       post: updatedPost,
//     });
//   } catch (error) {
//     console.error("");

//     console.error("================ EDIT POST ERROR ================");

//     console.error(error);

//     console.error("==================================================");

//     console.error("");

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update post",
//     });
//   }
// };

// /* ================================================================ */
// /* DELETE POST                                                       */
// /* ================================================================ */

// // const deletePost = async (req, res) => {
// //   try {
// //     const post = await Post.findById(req.params.id);

// //     if (!post) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Post not found",
// //       });
// //     }

// //     if (post.author.toString() !== req.user.userId.toString()) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "You can only delete your own post",
// //       });
// //     }

// //     await Post.findByIdAndDelete(req.params.id);

// //     return res.status(200).json({
// //       success: true,
// //       message: "Post deleted successfully",
// //     });
// //   } catch (error) {
// //     console.error("Delete post error:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: "Failed to delete post",
// //     });
// //   }
// // };
// const deletePost = async (req, res) => {
//   try {
//     console.log("========== DELETE POST ==========");
//     console.log("POST ID:", req.params.id);
//     console.log("USER:", req.user);

//     const post = await Post.findById(req.params.id);

//     console.log("POST FOUND:", post);

//     if (!post) {
//       console.log("POST NOT FOUND");

//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     console.log("POST AUTHOR:", post.author.toString());
//     console.log("CURRENT USER:", req.user.userId.toString());

//     if (post.author.toString() !== req.user.userId.toString()) {
//       console.log("USER IS NOT OWNER");

//       return res.status(403).json({
//         success: false,
//         message: "You can only delete your own post",
//       });
//     }

//     await Post.findByIdAndDelete(req.params.id);

//     console.log("POST DELETED SUCCESSFULLY");
//     console.log("================================");

//     return res.status(200).json({
//       success: true,
//       message: "Post deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE POST ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete post",
//     });
//   }
// };
// /* ================================================================ */
// /* EXPORTS                                                           */
// /* ================================================================ */

// module.exports = {
//   createPost,
//   getPosts,
//   getPostById,
//   updatePost,
//   deletePost,
// };
// const Comment = require("../models/comment");
// const Post = require("../models/post");
// const cloudinary = require("../config/cloudinary");

// /* ================================================================ */
// /* CREATE POST                                                       */
// /* ================================================================ */

// const createPost = async (req, res) => {
//   try {
//     const { title, body, category, imageWidth, imageHeight } = req.body;

//     if (!title || !body || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "Title, body and category are required",
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
//       category,
//       image: imageUrl,
//       imageWidth: imageWidth ? Number(imageWidth) : null,
//       imageHeight: imageHeight ? Number(imageHeight) : null,
//       author: req.user.userId,
//     });

//     /* ------------------------------------------------------------ */
//     /* GET CREATED POST WITH AUTHOR DETAILS                         */
//     /* ------------------------------------------------------------ */

//     const createdPost = await Post.findById(post._id).populate(
//       "author",
//       "name email profileImage",
//     );

//     /* ------------------------------------------------------------ */
//     /* REAL-TIME NEW POST UPDATE                                    */
//     /* ------------------------------------------------------------ */

//     try {
//       const { getIO } = require("../socket/socket");

//       const io = getIO();

//       io.emit("new-post", {
//         ...createdPost.toObject(),
//         commentCount: 0,
//       });

//       console.log("EVENT EMITTED: new-post");
//       console.log("Post ID:", createdPost._id.toString());
//     } catch (socketError) {
//       console.error("Socket new post error:", socketError);
//     }

//     /* ------------------------------------------------------------ */
//     /* RESPONSE                                                      */
//     /* ------------------------------------------------------------ */

//     return res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post: createdPost,
//     });
//   } catch (error) {
//     console.error("Create post error:", error);

//     return res.status(500).json({
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
//     const posts = await Post.find()
//       .populate("author", "name email profileImage")
//       .sort({
//         createdAt: -1,
//       });

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

//     return res.status(200).json({
//       success: true,
//       posts: postsWithCommentCount,
//     });
//   } catch (error) {
//     console.error("Get posts error:", error);

//     return res.status(500).json({
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
//       "name email profileImage",
//     );

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       post,
//     });
//   } catch (error) {
//     console.error("Get post error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch post",
//     });
//   }
// };

// /* ================================================================ */
// /* UPDATE POST                                                       */
// /* ================================================================ */

// const updatePost = async (req, res) => {
//   try {
//     /* ------------------------------------------------------------ */
//     /* DEBUG INFORMATION                                            */
//     /* ------------------------------------------------------------ */

//     console.log("");
//     console.log("================ EDIT POST REQUEST ================");

//     console.log("POST ID:", req.params.id);

//     console.log("USER:", req.user);

//     console.log("BODY:", req.body);

//     console.log("FILE:", req.file);

//     console.log("====================================================");

//     /* ------------------------------------------------------------ */
//     /* READ REQUEST DATA                                            */
//     /* ------------------------------------------------------------ */

//     const { title, body, category, imageWidth, imageHeight, removeImage } =
//       req.body;

//     /* ------------------------------------------------------------ */
//     /* VALIDATE                                                      */
//     /* ------------------------------------------------------------ */

//     if (!title || !body || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "Title, body and category are required",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* FIND POST                                                     */
//     /* ------------------------------------------------------------ */

//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       console.log("EDIT POST ERROR: Post not found");

//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CHECK USER                                                    */
//     /* ------------------------------------------------------------ */

//     if (!req.user) {
//       console.log("EDIT POST ERROR: User not found in request");

//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CHECK OWNERSHIP                                               */
//     /* ------------------------------------------------------------ */

//     if (post.author.toString() !== req.user.userId.toString()) {
//       console.log("EDIT POST ERROR: User is not the post owner");

//       console.log("POST AUTHOR:", post.author.toString());

//       console.log("CURRENT USER:", req.user.userId.toString());

//       return res.status(403).json({
//         success: false,
//         message: "You can only edit your own post",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* UPDATE TEXT AND CATEGORY                                      */
//     /* ------------------------------------------------------------ */

//     post.title = title;
//     post.body = body;
//     post.category = category;

//     /* ------------------------------------------------------------ */
//     /* REMOVE IMAGE                                                  */
//     /* ------------------------------------------------------------ */

//     if (removeImage === "true") {
//       console.log("Removing existing image");

//       post.image = "";
//       post.imageWidth = null;
//       post.imageHeight = null;
//     }

//     /* ------------------------------------------------------------ */
//     /* UPLOAD NEW IMAGE                                              */
//     /* ------------------------------------------------------------ */

//     if (req.file) {
//       console.log("New image received:", req.file.originalname);

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

//       console.log("Cloudinary image URL:", post.image);
//     }

//     /* ------------------------------------------------------------ */
//     /* SAVE                                                          */
//     /* ------------------------------------------------------------ */

//     await post.save();

//     console.log("Post saved successfully:", post._id.toString());

//     /* ------------------------------------------------------------ */
//     /* GET UPDATED POST                                              */
//     /* ------------------------------------------------------------ */

//     const updatedPost = await Post.findById(post._id).populate(
//       "author",
//       "name email profileImage",
//     );

//     console.log("================ EDIT POST SUCCESS ================");

//     console.log("");

//     return res.status(200).json({
//       success: true,
//       message: "Post updated successfully",
//       post: updatedPost,
//     });
//   } catch (error) {
//     console.error("");

//     console.error("================ EDIT POST ERROR ================");

//     console.error(error);

//     console.error("==================================================");

//     console.error("");

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update post",
//     });
//   }
// };

// /* ================================================================ */
// /* DELETE POST                                                       */
// /* ================================================================ */

// const deletePost = async (req, res) => {
//   try {
//     console.log("========== DELETE POST ==========");
//     console.log("POST ID:", req.params.id);
//     console.log("USER:", req.user);

//     const post = await Post.findById(req.params.id);

//     console.log("POST FOUND:", post);

//     if (!post) {
//       console.log("POST NOT FOUND");

//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     console.log("POST AUTHOR:", post.author.toString());
//     console.log("CURRENT USER:", req.user.userId.toString());

//     if (post.author.toString() !== req.user.userId.toString()) {
//       console.log("USER IS NOT OWNER");

//       return res.status(403).json({
//         success: false,
//         message: "You can only delete your own post",
//       });
//     }

//     await Post.findByIdAndDelete(req.params.id);

//     console.log("POST DELETED SUCCESSFULLY");
//     console.log("================================");

//     return res.status(200).json({
//       success: true,
//       message: "Post deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE POST ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete post",
//     });
//   }
// };

// /* ================================================================ */
// /* EXPORTS                                                           */
// /* ================================================================ */

// module.exports = {
//   createPost,
//   getPosts,
//   getPostById,
//   updatePost,
//   deletePost,
// };
const Post = require("../models/post");
const Comment = require("../models/comment");
const cloudinary = require("../config/cloudinary");

/* ================================================================ */
/* CREATE POST                                                       */
/* ================================================================ */

const createPost = async (req, res) => {
  try {
    const { title, body, category, imageWidth, imageHeight } = req.body;

    /* ------------------------------------------------------------ */
    /* VALIDATION                                                     */
    /* ------------------------------------------------------------ */

    if (!title || !body || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, body and category are required",
      });
    }

    /* ------------------------------------------------------------ */
    /* IMAGE UPLOAD                                                   */
    /* ------------------------------------------------------------ */

    let imageUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "blog-posts",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        uploadStream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    /* ------------------------------------------------------------ */
    /* CREATE POST                                                    */
    /* ------------------------------------------------------------ */

    const post = await Post.create({
      title,
      body,
      category,
      image: imageUrl,
      imageWidth: imageWidth ? Number(imageWidth) : null,
      imageHeight: imageHeight ? Number(imageHeight) : null,
      author: req.user.userId,
    });

    /* ------------------------------------------------------------ */
    /* GET CREATED POST WITH AUTHOR                                  */
    /* ------------------------------------------------------------ */

    const createdPost = await Post.findById(post._id).populate(
      "author",
      "name email profileImage",
    );

    /* ------------------------------------------------------------ */
    /* REAL-TIME NEW POST                                            */
    /* ------------------------------------------------------------ */

    try {
      const { getIO } = require("../socket/socket");

      const io = getIO();

      io.emit("new-post", {
        ...createdPost.toObject(),
        commentCount: 0,
      });

      console.log("EVENT EMITTED: new-post");

      console.log("Post ID:", createdPost._id.toString());
    } catch (socketError) {
      console.error("Socket new post error:", socketError);
    }

    /* ------------------------------------------------------------ */
    /* RESPONSE                                                       */
    /* ------------------------------------------------------------ */

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: createdPost,
    });
  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      success: false,
      message: "Post creation failed",
    });
  }
};

/* ================================================================ */
/* GET ALL POSTS                                                     */
/* ================================================================ */

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email profileImage")
      .sort({
        createdAt: -1,
      });

    /* ------------------------------------------------------------ */
    /* ADD COMMENT COUNT                                             */
    /* ------------------------------------------------------------ */

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({
          post: post._id,
        });

        return {
          ...post.toObject(),
          commentCount,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      posts: postsWithComments,
    });
  } catch (error) {
    console.error("Get posts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

/* ================================================================ */
/* GET SINGLE POST                                                   */
/* ================================================================ */

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate(
      "author",
      "name email profileImage",
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    /* ------------------------------------------------------------ */
    /* COMMENT COUNT                                                 */
    /* ------------------------------------------------------------ */

    const commentCount = await Comment.countDocuments({
      post: post._id,
    });

    return res.status(200).json({
      success: true,
      post: {
        ...post.toObject(),
        commentCount,
      },
    });
  } catch (error) {
    console.error("Get post by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch post",
    });
  }
};

/* ================================================================ */
/* UPDATE POST                                                       */
/* ================================================================ */

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, body, category, removeImage, imageWidth, imageHeight } =
      req.body;

    /* ------------------------------------------------------------ */
    /* FIND POST                                                      */
    /* ------------------------------------------------------------ */

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    /* ------------------------------------------------------------ */
    /* CHECK POST OWNER                                               */
    /* ------------------------------------------------------------ */

    if (post.author.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this post",
      });
    }

    /* ------------------------------------------------------------ */
    /* VALIDATION                                                     */
    /* ------------------------------------------------------------ */

    if (!title || !body || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, body and category are required",
      });
    }

    /* ------------------------------------------------------------ */
    /* UPDATE BASIC DATA                                             */
    /* ------------------------------------------------------------ */

    post.title = title;
    post.body = body;
    post.category = category;

    /* ------------------------------------------------------------ */
    /* REMOVE OLD IMAGE                                              */
    /* ------------------------------------------------------------ */

    if (removeImage === "true" || removeImage === true) {
      post.image = "";
      post.imageWidth = null;
      post.imageHeight = null;
    }

    /* ------------------------------------------------------------ */
    /* UPLOAD NEW IMAGE                                              */
    /* ------------------------------------------------------------ */

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "blog-posts",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        uploadStream.end(req.file.buffer);
      });

      post.image = result.secure_url;

      post.imageWidth = imageWidth ? Number(imageWidth) : null;

      post.imageHeight = imageHeight ? Number(imageHeight) : null;
    }

    /* ------------------------------------------------------------ */
    /* SAVE                                                          */
    /* ------------------------------------------------------------ */

    await post.save();

    /* ------------------------------------------------------------ */
    /* GET UPDATED POST WITH AUTHOR                                  */
    /* ------------------------------------------------------------ */

    const updatedPost = await Post.findById(post._id).populate(
      "author",
      "name email profileImage",
    );

    /* ------------------------------------------------------------ */
    /* GET COMMENT COUNT                                             */
    /* ------------------------------------------------------------ */

    const commentCount = await Comment.countDocuments({
      post: updatedPost._id,
    });

    const postData = {
      ...updatedPost.toObject(),
      commentCount,
    };

    /* ------------------------------------------------------------ */
    /* REAL-TIME POST UPDATE                                         */
    /* ------------------------------------------------------------ */

    try {
      const { getIO } = require("../socket/socket");

      const io = getIO();

      io.emit("post-updated", postData);

      console.log("EVENT EMITTED: post-updated");

      console.log("Post ID:", updatedPost._id.toString());
    } catch (socketError) {
      console.error("Socket post update error:", socketError);
    }

    /* ------------------------------------------------------------ */
    /* RESPONSE                                                       */
    /* ------------------------------------------------------------ */

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: postData,
    });
  } catch (error) {
    console.error("Update post error:", error);

    return res.status(500).json({
      success: false,
      message: "Post update failed",
    });
  }
};

/* ================================================================ */
/* DELETE POST                                                       */
/* ================================================================ */

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    /* ------------------------------------------------------------ */
    /* FIND POST                                                      */
    /* ------------------------------------------------------------ */

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    /* ------------------------------------------------------------ */
    /* CHECK POST OWNER                                               */
    /* ------------------------------------------------------------ */

    if (post.author.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    /* ------------------------------------------------------------ */
    /* DELETE POST                                                    */
    /* ------------------------------------------------------------ */

    await Post.findByIdAndDelete(id);

    /* ------------------------------------------------------------ */
    /* REAL-TIME POST DELETE                                         */
    /* ------------------------------------------------------------ */

    try {
      const { getIO } = require("../socket/socket");

      const io = getIO();

      io.emit("post-deleted", {
        postId: id,
      });

      console.log("EVENT EMITTED: post-deleted");

      console.log("Post ID:", id);
    } catch (socketError) {
      console.error("Socket post delete error:", socketError);
    }

    /* ------------------------------------------------------------ */
    /* RESPONSE                                                       */
    /* ------------------------------------------------------------ */

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      postId: id,
    });
  } catch (error) {
    console.error("Delete post error:", error);

    return res.status(500).json({
      success: false,
      message: "Post deletion failed",
    });
  }
};

/* ================================================================ */
/* EXPORTS                                                           */
/* ================================================================ */

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
