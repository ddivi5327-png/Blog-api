// const Comment = require("../models/comment");
// const Post = require("../models/post");
// const Notification = require("../models/notification");

// /* ================================================================ */
// /* CREATE COMMENT / REPLY                                            */
// /* ================================================================ */

// const createComment = async (req, res) => {
//   try {
//     const { text, parentComment } = req.body;
//     const { postId } = req.params;
//     const userId = req.user.userId;

//     /* ------------------------------------------------------------ */
//     /* VALIDATE TEXT                                                  */
//     /* ------------------------------------------------------------ */

//     if (!text || !text.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Comment text is required",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CHECK POST                                                     */
//     /* ------------------------------------------------------------ */

//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     /* ============================================================ */
//     /* REPLY                                                          */
//     /* ============================================================ */

//     if (parentComment) {
//       /* ---------------------------------------------------------- */
//       /* FIND PARENT COMMENT                                         */
//       /* ---------------------------------------------------------- */

//       const parent = await Comment.findById(parentComment);

//       if (!parent) {
//         return res.status(404).json({
//           success: false,
//           message: "Comment to reply to was not found",
//         });
//       }

//       /* ---------------------------------------------------------- */
//       /* CHECK SAME POST                                              */
//       /* ---------------------------------------------------------- */

//       if (parent.post.toString() !== postId.toString()) {
//         return res.status(400).json({
//           success: false,
//           message: "Cannot reply to a comment from another post",
//         });
//       }

//       /* ---------------------------------------------------------- */
//       /* USER CANNOT REPLY TO OWN COMMENT                            */
//       /* ---------------------------------------------------------- */

//       if (parent.author.toString() === userId.toString()) {
//         return res.status(400).json({
//           success: false,
//           message: "You cannot reply to your own comment",
//         });
//       }

//       /* ---------------------------------------------------------- */
//       /* CREATE REPLY                                                 */
//       /* ---------------------------------------------------------- */

//       const reply = await Comment.create({
//         post: postId,
//         author: userId,
//         text: text.trim(),
//         parentComment: parent._id,
//       });

//       /* ---------------------------------------------------------- */
//       /* POPULATE REPLY                                               */
//       /* ---------------------------------------------------------- */

//       const populatedReply = await Comment.findById(reply._id).populate(
//         "author",
//         "name email profileImage",
//       );

//       /* ---------------------------------------------------------- */
//       /* REAL-TIME REPLY                                              */
//       /* ---------------------------------------------------------- */

//       try {
//         const { getIO } = require("../socket/socket");

//         getIO().to(`post-${postId}`).emit("new-comment", populatedReply);

//         console.log("Real-time reply sent:", reply._id.toString());
//       } catch (socketError) {
//         console.error("Real-time reply socket error:", socketError);
//       }

//       /* ---------------------------------------------------------- */
//       /* CREATE REPLY NOTIFICATION                                    */
//       /* ---------------------------------------------------------- */

//       try {
//         const notification = await Notification.create({
//           recipient: parent.author,
//           sender: userId,
//           type: "comment",
//           post: post._id,
//           message: "Someone replied to your comment",
//         });

//         /* -------------------------------------------------------- */
//         /* POPULATE NOTIFICATION                                     */
//         /* -------------------------------------------------------- */

//         const populatedNotification = await Notification.findById(
//           notification._id,
//         )
//           .populate("sender", "name email profileImage")
//           .populate("post", "title");

//         /* -------------------------------------------------------- */
//         /* SEND REAL-TIME NOTIFICATION                               */
//         /* -------------------------------------------------------- */

//         try {
//           const { getIO } = require("../socket/socket");

//           getIO()
//             .to(parent.author.toString())
//             .emit("new-notification", populatedNotification);

//           console.log("Reply notification sent through socket");
//         } catch (socketError) {
//           console.error("Socket notification error:", socketError);
//         }
//       } catch (notificationError) {
//         console.error("Create reply notification error:", notificationError);
//       }

//       return res.status(201).json({
//         success: true,
//         message: "Reply added successfully",
//         comment: populatedReply,
//       });
//     }

//     /* ============================================================ */
//     /* TOP LEVEL COMMENT                                              */
//     /* ============================================================ */

//     /*
//      * A user can have only ONE main comment
//      * on a particular post.
//      *
//      * Replies are unlimited.
//      */

//     const existingComment = await Comment.findOne({
//       post: postId,
//       author: userId,
//       parentComment: null,
//     });

//     if (existingComment) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "You have already commented on this post. You can reply to your existing comment.",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CREATE MAIN COMMENT                                            */
//     /* ------------------------------------------------------------ */

//     const comment = await Comment.create({
//       post: postId,
//       author: userId,
//       text: text.trim(),
//       parentComment: null,
//     });

//     /* ------------------------------------------------------------ */
//     /* POPULATE COMMENT                                               */
//     /* ------------------------------------------------------------ */

//     const populatedComment = await Comment.findById(comment._id).populate(
//       "author",
//       "name email profileImage",
//     );

//     /* ------------------------------------------------------------ */
//     /* REAL-TIME COMMENT                                              */
//     /* ------------------------------------------------------------ */

//     try {
//       const { getIO } = require("../socket/socket");

//       getIO().to(`post-${postId}`).emit("new-comment", populatedComment);

//       console.log("Real-time comment sent:", comment._id.toString());
//     } catch (socketError) {
//       console.error("Real-time comment socket error:", socketError);
//     }

//     /* ------------------------------------------------------------ */
//     /* NOTIFY POST OWNER                                              */
//     /* ------------------------------------------------------------ */

//     if (post.author.toString() !== userId.toString()) {
//       try {
//         const notification = await Notification.create({
//           recipient: post.author,
//           sender: userId,
//           type: "comment",
//           post: post._id,
//           message: "Someone commented on your post",
//         });

//         /* -------------------------------------------------------- */
//         /* POPULATE NOTIFICATION                                     */
//         /* -------------------------------------------------------- */

//         const populatedNotification = await Notification.findById(
//           notification._id,
//         )
//           .populate("sender", "name email profileImage")
//           .populate("post", "title");

//         /* -------------------------------------------------------- */
//         /* SEND REAL-TIME NOTIFICATION                               */
//         /* -------------------------------------------------------- */

//         try {
//           const { getIO } = require("../socket/socket");

//           getIO()
//             .to(post.author.toString())
//             .emit("new-notification", populatedNotification);

//           console.log("Comment notification sent through socket");
//         } catch (socketError) {
//           console.error("Socket notification error:", socketError);
//         }
//       } catch (notificationError) {
//         console.error("Create comment notification error:", notificationError);
//       }
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Comment added successfully",
//       comment: populatedComment,
//     });
//   } catch (error) {
//     console.error("Create comment error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create comment",
//     });
//   }
// };

// /* ================================================================ */
// /* GET COMMENTS                                                      */
// /* ================================================================ */

// const getComments = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const comments = await Comment.find({
//       post: postId,
//     })
//       .populate("author", "name email profileImage")
//       .sort({
//         createdAt: 1,
//       });

//     return res.status(200).json({
//       success: true,
//       comments,
//     });
//   } catch (error) {
//     console.error("Get comments error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch comments",
//     });
//   }
// };

// /* ================================================================ */
// /* DELETE COMMENT                                                    */
// /* ================================================================ */

// const deleteComment = async (req, res) => {
//   try {
//     const comment = await Comment.findById(req.params.id);

//     if (!comment) {
//       return res.status(404).json({
//         success: false,
//         message: "Comment not found",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* ONLY OWNER CAN DELETE                                          */
//     /* ------------------------------------------------------------ */

//     if (comment.author.toString() !== req.user.userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "You can only delete your own comment",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* DELETE COMMENT                                                 */
//     /* ------------------------------------------------------------ */

//     await Comment.findByIdAndDelete(req.params.id);

//     return res.status(200).json({
//       success: true,
//       message: "Comment deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete comment error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete comment",
//     });
//   }
// };

// /* ================================================================ */
// /* EXPORTS                                                           */
// /* ================================================================ */

// module.exports = {
//   createComment,
//   getComments,
//   deleteComment,
// };
// const Comment = require("../models/comment");
// const Post = require("../models/post");
// const Notification = require("../models/notification");

// /* ================================================================ */
// /* CREATE COMMENT / REPLY                                           */
// /* ================================================================ */

// const createComment = async (req, res) => {
//   try {
//     const { text, parentComment } = req.body;
//     const { postId } = req.params;
//     const userId = req.user.userId;

//     /* ------------------------------------------------------------ */
//     /* VALIDATE TEXT                                                  */
//     /* ------------------------------------------------------------ */

//     if (!text || !text.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Comment text is required",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CHECK POST                                                     */
//     /* ------------------------------------------------------------ */

//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     /* ============================================================ */
//     /* REPLY                                                          */
//     /* ============================================================ */

//     if (parentComment) {
//       /* ---------------------------------------------------------- */
//       /* FIND PARENT COMMENT                                         */
//       /* ---------------------------------------------------------- */

//       const parent = await Comment.findById(parentComment);

//       if (!parent) {
//         return res.status(404).json({
//           success: false,
//           message: "Comment to reply to was not found",
//         });
//       }

//       /* ---------------------------------------------------------- */
//       /* CHECK SAME POST                                              */
//       /* ---------------------------------------------------------- */

//       if (parent.post.toString() !== postId.toString()) {
//         return res.status(400).json({
//           success: false,
//           message: "Cannot reply to a comment from another post",
//         });
//       }

//       /* ---------------------------------------------------------- */
//       /* USER CANNOT REPLY TO OWN COMMENT                            */
//       /* ---------------------------------------------------------- */

//       if (parent.author.toString() === userId.toString()) {
//         return res.status(400).json({
//           success: false,
//           message: "You cannot reply to your own comment",
//         });
//       }

//       /* ---------------------------------------------------------- */
//       /* CREATE REPLY                                                 */
//       /* ---------------------------------------------------------- */

//       const reply = await Comment.create({
//         post: postId,
//         author: userId,
//         text: text.trim(),
//         parentComment: parent._id,
//       });

//       /* ---------------------------------------------------------- */
//       /* POPULATE REPLY                                               */
//       /* ---------------------------------------------------------- */

//       const populatedReply = await Comment.findById(reply._id).populate(
//         "author",
//         "name email profileImage",
//       );

//       /* ---------------------------------------------------------- */
//       /* REAL-TIME REPLY                                              */
//       /* ---------------------------------------------------------- */

//       try {
//         const { getIO } = require("../socket/socket");

//         // IMPORTANT:
//         // Home joins: post:${postId}
//         // Therefore we must emit to the same room.
//         getIO().to(`post:${postId}`).emit("new-comment", populatedReply);

//         console.log("Real-time reply sent:", reply._id.toString());
//       } catch (socketError) {
//         console.error("Real-time reply socket error:", socketError);
//       }

//       /* ---------------------------------------------------------- */
//       /* CREATE REPLY NOTIFICATION                                    */
//       /* ---------------------------------------------------------- */

//       try {
//         const notification = await Notification.create({
//           recipient: parent.author,
//           sender: userId,
//           type: "comment",
//           post: post._id,
//           message: "Someone replied to your comment",
//         });

//         /* -------------------------------------------------------- */
//         /* POPULATE NOTIFICATION                                     */
//         /* -------------------------------------------------------- */

//         const populatedNotification = await Notification.findById(
//           notification._id,
//         )
//           .populate("sender", "name email profileImage")
//           .populate("post", "title");

//         /* -------------------------------------------------------- */
//         /* SEND REAL-TIME NOTIFICATION                               */
//         /* -------------------------------------------------------- */

//         try {
//           const { getIO } = require("../socket/socket");

//           getIO()
//             .to(parent.author.toString())
//             .emit("new-notification", populatedNotification);

//           console.log("Reply notification sent through socket");
//         } catch (socketError) {
//           console.error("Socket notification error:", socketError);
//         }
//       } catch (notificationError) {
//         console.error("Create reply notification error:", notificationError);
//       }

//       return res.status(201).json({
//         success: true,
//         message: "Reply added successfully",
//         comment: populatedReply,
//       });
//     }

//     /* ============================================================ */
//     /* TOP LEVEL COMMENT                                              */
//     /* ============================================================ */

//     const existingComment = await Comment.findOne({
//       post: postId,
//       author: userId,
//       parentComment: null,
//     });

//     if (existingComment) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "You have already commented on this post. You can reply to your existing comment.",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CREATE MAIN COMMENT                                            */
//     /* ------------------------------------------------------------ */

//     const comment = await Comment.create({
//       post: postId,
//       author: userId,
//       text: text.trim(),
//       parentComment: null,
//     });

//     /* ------------------------------------------------------------ */
//     /* POPULATE COMMENT                                               */
//     /* ------------------------------------------------------------ */

//     const populatedComment = await Comment.findById(comment._id).populate(
//       "author",
//       "name email profileImage",
//     );

//     /* ------------------------------------------------------------ */
//     /* REAL-TIME COMMENT                                              */
//     /* ------------------------------------------------------------ */

//     try {
//       const { getIO } = require("../socket/socket");

//       // IMPORTANT:
//       // Home joins post:${postId}
//       // So emit to the same room.
//       getIO().to(`post:${postId}`).emit("new-comment", populatedComment);

//       console.log("Real-time comment sent:", comment._id.toString());
//     } catch (socketError) {
//       console.error("Real-time comment socket error:", socketError);
//     }

//     /* ------------------------------------------------------------ */
//     /* NOTIFY POST OWNER                                              */
//     /* ------------------------------------------------------------ */

//     if (post.author.toString() !== userId.toString()) {
//       try {
//         const notification = await Notification.create({
//           recipient: post.author,
//           sender: userId,
//           type: "comment",
//           post: post._id,
//           message: "Someone commented on your post",
//         });

//         /* -------------------------------------------------------- */
//         /* POPULATE NOTIFICATION                                     */
//         /* -------------------------------------------------------- */

//         const populatedNotification = await Notification.findById(
//           notification._id,
//         )
//           .populate("sender", "name email profileImage")
//           .populate("post", "title");

//         /* -------------------------------------------------------- */
//         /* SEND REAL-TIME NOTIFICATION                               */
//         /* -------------------------------------------------------- */

//         try {
//           const { getIO } = require("../socket/socket");

//           getIO()
//             .to(post.author.toString())
//             .emit("new-notification", populatedNotification);

//           console.log("Comment notification sent through socket");
//         } catch (socketError) {
//           console.error("Socket notification error:", socketError);
//         }
//       } catch (notificationError) {
//         console.error("Create comment notification error:", notificationError);
//       }
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Comment added successfully",
//       comment: populatedComment,
//     });
//   } catch (error) {
//     console.error("Create comment error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create comment",
//     });
//   }
// };

// /* ================================================================ */
// /* GET COMMENTS                                                      */
// /* ================================================================ */

// const getComments = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const comments = await Comment.find({
//       post: postId,
//     })
//       .populate("author", "name email profileImage")
//       .sort({
//         createdAt: 1,
//       });

//     return res.status(200).json({
//       success: true,
//       comments,
//     });
//   } catch (error) {
//     console.error("Get comments error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch comments",
//     });
//   }
// };

// /* ================================================================ */
// /* DELETE COMMENT                                                    */
// /* ================================================================ */

// const deleteComment = async (req, res) => {
//   try {
//     const comment = await Comment.findById(req.params.id);

//     if (!comment) {
//       return res.status(404).json({
//         success: false,
//         message: "Comment not found",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* ONLY OWNER CAN DELETE                                          */
//     /* ------------------------------------------------------------ */

//     if (comment.author.toString() !== req.user.userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "You can only delete your own comment",
//       });
//     }

//     const postId = comment.post.toString();

//     const parentCommentId = comment.parentComment
//       ? comment.parentComment.toString()
//       : null;

//     /* ------------------------------------------------------------ */
//     /* DELETE COMMENT                                                 */
//     /* ------------------------------------------------------------ */

//     await Comment.findByIdAndDelete(req.params.id);

//     /* ------------------------------------------------------------ */
//     /* DELETE REPLIES IF MAIN COMMENT IS DELETED                    */
//     /* ------------------------------------------------------------ */

//     if (!comment.parentComment) {
//       await Comment.deleteMany({
//         parentComment: req.params.id,
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* REAL-TIME COMMENT DELETE                                      */
//     /* ------------------------------------------------------------ */

//     try {
//       const { getIO } = require("../socket/socket");

//       // IMPORTANT:
//       // Same room used by Home.
//       getIO().to(`post:${postId}`).emit("comment-deleted", {
//         commentId: req.params.id.toString(),
//         postId,
//         parentCommentId,
//       });

//       console.log("Real-time comment delete sent:", req.params.id.toString());
//     } catch (socketError) {
//       console.error("Real-time comment delete socket error:", socketError);
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Comment deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete comment error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete comment",
//     });
//   }
// };

// /* ================================================================ */
// /* EXPORTS                                                           */
// /* ================================================================ */

// module.exports = {
//   createComment,
//   getComments,
//   deleteComment,
// };
const Comment = require("../models/comment");
const Post = require("../models/post");
const Notification = require("../models/notification");

/* ================================================================ */
/* CREATE COMMENT / REPLY                                           */
/* ================================================================ */

const createComment = async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    const { postId } = req.params;
    const userId = req.user.userId;

    /* ------------------------------------------------------------ */
    /* VALIDATE TEXT                                                  */
    /* ------------------------------------------------------------ */

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    /* ------------------------------------------------------------ */
    /* CHECK POST                                                     */
    /* ------------------------------------------------------------ */

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    /* ============================================================ */
    /* REPLY                                                          */
    /* ============================================================ */

    if (parentComment) {
      /* ---------------------------------------------------------- */
      /* FIND PARENT COMMENT                                         */
      /* ---------------------------------------------------------- */

      const parent = await Comment.findById(parentComment);

      if (!parent) {
        return res.status(404).json({
          success: false,
          message: "Comment to reply to was not found",
        });
      }

      /* ---------------------------------------------------------- */
      /* CHECK SAME POST                                              */
      /* ---------------------------------------------------------- */

      if (parent.post.toString() !== postId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot reply to a comment from another post",
        });
      }

      /* ---------------------------------------------------------- */
      /* USER CANNOT REPLY TO OWN COMMENT                            */
      /* ---------------------------------------------------------- */

      if (parent.author.toString() === userId.toString()) {
        return res.status(400).json({
          success: false,
          message: "You cannot reply to your own comment",
        });
      }

      /* ---------------------------------------------------------- */
      /* CREATE REPLY                                                 */
      /* ---------------------------------------------------------- */

      const reply = await Comment.create({
        post: postId,
        author: userId,
        text: text.trim(),
        parentComment: parent._id,
      });

      /* ---------------------------------------------------------- */
      /* POPULATE REPLY                                               */
      /* ---------------------------------------------------------- */

      const populatedReply = await Comment.findById(reply._id).populate(
        "author",
        "name email profileImage",
      );

      /* ---------------------------------------------------------- */
      /* REAL-TIME REPLY                                              */
      /* ---------------------------------------------------------- */

      try {
        const { getIO } = require("../socket/socket");

        getIO().to(`post:${postId}`).emit("new-comment", populatedReply);

        console.log("Real-time reply sent:", reply._id.toString());
      } catch (socketError) {
        console.error("Real-time reply socket error:", socketError);
      }

      /* ---------------------------------------------------------- */
      /* CREATE REPLY NOTIFICATION                                    */
      /* ---------------------------------------------------------- */

      try {
        const notification = await Notification.create({
          recipient: parent.author,
          sender: userId,
          type: "comment",
          post: post._id,
          message: "Someone replied to your comment",
        });

        /* -------------------------------------------------------- */
        /* POPULATE NOTIFICATION                                     */
        /* -------------------------------------------------------- */

        const populatedNotification = await Notification.findById(
          notification._id,
        )
          .populate("sender", "name email profileImage")
          .populate("post", "title");

        /* -------------------------------------------------------- */
        /* SEND REAL-TIME NOTIFICATION                               */
        /* -------------------------------------------------------- */

        try {
          const { getIO } = require("../socket/socket");

          getIO()
            .to(parent.author.toString())
            .emit("new-notification", populatedNotification);

          console.log("Reply notification sent through socket");
        } catch (socketError) {
          console.error("Socket notification error:", socketError);
        }
      } catch (notificationError) {
        console.error("Create reply notification error:", notificationError);
      }

      return res.status(201).json({
        success: true,
        message: "Reply added successfully",
        comment: populatedReply,
      });
    }

    /* ============================================================ */
    /* TOP LEVEL COMMENT                                              */
    /* ============================================================ */

    const existingComment = await Comment.findOne({
      post: postId,
      author: userId,
      parentComment: null,
    });

    if (existingComment) {
      return res.status(400).json({
        success: false,
        message:
          "You have already commented on this post. You can reply to your existing comment.",
      });
    }

    /* ------------------------------------------------------------ */
    /* CREATE MAIN COMMENT                                            */
    /* ------------------------------------------------------------ */

    const comment = await Comment.create({
      post: postId,
      author: userId,
      text: text.trim(),
      parentComment: null,
    });

    /* ------------------------------------------------------------ */
    /* POPULATE COMMENT                                               */
    /* ------------------------------------------------------------ */

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name email profileImage",
    );

    /* ------------------------------------------------------------ */
    /* REAL-TIME COMMENT                                              */
    /* ------------------------------------------------------------ */

    try {
      const { getIO } = require("../socket/socket");

      getIO().to(`post:${postId}`).emit("new-comment", populatedComment);

      console.log("Real-time comment sent:", comment._id.toString());
    } catch (socketError) {
      console.error("Real-time comment socket error:", socketError);
    }

    /* ------------------------------------------------------------ */
    /* NOTIFY POST OWNER                                              */
    /* ------------------------------------------------------------ */

    if (post.author.toString() !== userId.toString()) {
      try {
        const notification = await Notification.create({
          recipient: post.author,
          sender: userId,
          type: "comment",
          post: post._id,
          message: "Someone commented on your post",
        });

        /* -------------------------------------------------------- */
        /* POPULATE NOTIFICATION                                     */
        /* -------------------------------------------------------- */

        const populatedNotification = await Notification.findById(
          notification._id,
        )
          .populate("sender", "name email profileImage")
          .populate("post", "title");

        /* -------------------------------------------------------- */
        /* SEND REAL-TIME NOTIFICATION                               */
        /* -------------------------------------------------------- */

        try {
          const { getIO } = require("../socket/socket");

          getIO()
            .to(post.author.toString())
            .emit("new-notification", populatedNotification);

          console.log("Comment notification sent through socket");
        } catch (socketError) {
          console.error("Socket notification error:", socketError);
        }
      } catch (notificationError) {
        console.error("Create comment notification error:", notificationError);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Create comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create comment",
    });
  }
};

/* ================================================================ */
/* GET COMMENTS                                                      */
/* ================================================================ */

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      post: postId,
    })
      .populate("author", "name email profileImage")
      .sort({
        createdAt: 1,
      });

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

/* ================================================================ */
/* DELETE COMMENT                                                    */
/* ================================================================ */

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.userId;

    /* ------------------------------------------------------------ */
    /* FIND COMMENT                                                   */
    /* ------------------------------------------------------------ */

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    /* ------------------------------------------------------------ */
    /* ONLY OWNER CAN DELETE                                          */
    /* ------------------------------------------------------------ */

    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comment",
      });
    }

    const postId = comment.post.toString();

    const parentCommentId = comment.parentComment
      ? comment.parentComment.toString()
      : null;

    /* ------------------------------------------------------------ */
    /* DELETE MAIN COMMENT                                            */
    /* ------------------------------------------------------------ */

    await Comment.findByIdAndDelete(commentId);

    /* ------------------------------------------------------------ */
    /* DELETE REPLIES                                                 */
    /* ------------------------------------------------------------ */

    let deletedReplyCount = 0;

    if (!comment.parentComment) {
      const deleteResult = await Comment.deleteMany({
        parentComment: commentId,
      });

      deletedReplyCount = deleteResult.deletedCount || 0;
    }

    /* ------------------------------------------------------------ */
    /* REAL-TIME DELETE EVENT                                         */
    /* ------------------------------------------------------------ */

    try {
      const { getIO } = require("../socket/socket");

      getIO().to(`post:${postId}`).emit("comment-deleted", {
        commentId: commentId.toString(),
        postId,
        parentCommentId,
        deletedReplyCount,
      });

      console.log(
        "Real-time comment delete sent:",
        commentId.toString(),
        "Deleted replies:",
        deletedReplyCount,
      );
    } catch (socketError) {
      console.error("Real-time comment delete socket error:", socketError);
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      commentId: commentId.toString(),
      postId,
      parentCommentId,
      deletedReplyCount,
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};

/* ================================================================ */
/* EXPORTS                                                           */
/* ================================================================ */

module.exports = {
  createComment,
  getComments,
  deleteComment,
};
