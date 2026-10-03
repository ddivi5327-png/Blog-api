// const Like = require("../models/like");
// const Post = require("../models/post");
// const Notification = require("../models/notification");

// /* ================================================================ */
// /* TOGGLE LIKE                                                       */
// /* ================================================================ */

// const toggleLike = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user.userId;

//     /* ------------------------------------------------------------ */
//     /* CHECK EXISTING LIKE                                          */
//     /* ------------------------------------------------------------ */

//     const existingLike = await Like.findOne({
//       post: postId,
//       user: userId,
//     });

//     /* ------------------------------------------------------------ */
//     /* UNLIKE                                                        */
//     /* ------------------------------------------------------------ */

//     if (existingLike) {
//       await Like.findByIdAndDelete(existingLike._id);

//       const likeCount = await Like.countDocuments({
//         post: postId,
//       });

//       return res.status(200).json({
//         success: true,
//         liked: false,
//         likeCount,
//         message: "Post unliked successfully",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CREATE LIKE                                                   */
//     /* ------------------------------------------------------------ */

//     await Like.create({
//       post: postId,
//       user: userId,
//     });

//     /* ------------------------------------------------------------ */
//     /* CREATE NOTIFICATION                                           */
//     /* ------------------------------------------------------------ */

//     const post = await Post.findById(postId);

//     if (post) {
//       /*
//        * Don't notify the user when they like
//        * their own post.
//        */

//       if (post.author.toString() !== userId.toString()) {
//         try {
//           const notification = await Notification.create({
//             recipient: post.author,
//             sender: userId,
//             type: "like",
//             post: post._id,
//             message: "Someone liked your post",
//           });

//           console.log("Like notification created");

//           /* ------------------------------------------------------ */
//           /* SEND REAL-TIME SOCKET NOTIFICATION                     */
//           /* ------------------------------------------------------ */

//           try {
//             const { getIO } = require("../socket/socket");

//             getIO()
//               .to(`user:${post.author.toString()}`)
//               .emit("new-notification", notification);

//             console.log("Like notification sent through socket");
//           } catch (socketError) {
//             /*
//              * Socket failure should not make
//              * the like request fail.
//              */
//             console.error("Socket notification error:", socketError);
//           }
//         } catch (notificationError) {
//           /*
//            * The like should still succeed
//            * even if notification creation fails.
//            */
//           console.error("Create like notification error:", notificationError);
//         }
//       }
//     }

//     /* ------------------------------------------------------------ */
//     /* LIKE COUNT                                                    */
//     /* ------------------------------------------------------------ */

//     const likeCount = await Like.countDocuments({
//       post: postId,
//     });

//     return res.status(201).json({
//       success: true,
//       liked: true,
//       likeCount,
//       message: "Post liked successfully",
//     });
//   } catch (error) {
//     console.error("Toggle like error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update like",
//     });
//   }
// };

// /* ================================================================ */
// /* GET LIKE INFO                                                     */
// /* ================================================================ */

// const getLikeInfo = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user.userId;

//     const likeCount = await Like.countDocuments({
//       post: postId,
//     });

//     const userLike = await Like.findOne({
//       post: postId,
//       user: userId,
//     });

//     return res.status(200).json({
//       success: true,
//       likeCount,
//       liked: !!userLike,
//     });
//   } catch (error) {
//     console.error("Get like info error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch like information",
//     });
//   }
// };

// /* ================================================================ */
// /* EXPORTS                                                           */
// /* ================================================================ */

// module.exports = {
//   toggleLike,
//   getLikeInfo,
// };
// const Like = require("../models/like");
// const Post = require("../models/post");
// const Notification = require("../models/notification");

// /* ================================================================ */
// /* TOGGLE LIKE                                                       */
// /* ================================================================ */

// const toggleLike = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user.userId;

//     /* ------------------------------------------------------------ */
//     /* CHECK EXISTING LIKE                                           */
//     /* ------------------------------------------------------------ */

//     const existingLike = await Like.findOne({
//       post: postId,
//       user: userId,
//     });

//     /* ------------------------------------------------------------ */
//     /* UNLIKE                                                        */
//     /* ------------------------------------------------------------ */

//     if (existingLike) {
//       await Like.findByIdAndDelete(existingLike._id);

//       const likeCount = await Like.countDocuments({
//         post: postId,
//       });

//       return res.status(200).json({
//         success: true,
//         liked: false,
//         likeCount,
//         message: "Post unliked successfully",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CREATE LIKE                                                   */
//     /* ------------------------------------------------------------ */

//     await Like.create({
//       post: postId,
//       user: userId,
//     });

//     /* ------------------------------------------------------------ */
//     /* GET POST                                                      */
//     /* ------------------------------------------------------------ */

//     const post = await Post.findById(postId);

//     if (post) {
//       /* ---------------------------------------------------------- */
//       /* DON'T NOTIFY USER ABOUT THEIR OWN LIKE                    */
//       /* ---------------------------------------------------------- */

//       if (post.author.toString() !== userId.toString()) {
//         try {
//           /* ------------------------------------------------------ */
//           /* CREATE NOTIFICATION                                   */
//           /* ------------------------------------------------------ */

//           const notification = await Notification.create({
//             recipient: post.author,
//             sender: userId,
//             type: "like",
//             post: post._id,
//             message: "Someone liked your post",
//           });

//           console.log("Like notification created");

//           /* ------------------------------------------------------ */
//           /* SEND REAL-TIME SOCKET NOTIFICATION                     */
//           /* ------------------------------------------------------ */

//           try {
//             const { getIO } = require("../socket/socket");

//             const io = getIO();

//             const roomName = `user:${post.author.toString()}`;

//             console.log("NOTIFICATION TARGET ROOM:", roomName);

//             console.log(
//               "ROOM SOCKETS:",
//               io.sockets.adapter.rooms.get(roomName),
//             );

//             io.to(roomName).emit("new-notification", notification);

//             console.log("Like notification sent through socket");
//           } catch (socketError) {
//             /*
//              * Socket failure should not make
//              * the like request fail.
//              */

//             console.error("Socket notification error:", socketError);
//           }
//         } catch (notificationError) {
//           /*
//            * Like should still succeed even if
//            * notification creation fails.
//            */

//           console.error("Create like notification error:", notificationError);
//         }
//       }
//     }

//     /* ------------------------------------------------------------ */
//     /* GET LIKE COUNT                                                */
//     /* ------------------------------------------------------------ */

//     const likeCount = await Like.countDocuments({
//       post: postId,
//     });

//     /* ------------------------------------------------------------ */
//     /* RESPONSE                                                      */
//     /* ------------------------------------------------------------ */

//     return res.status(201).json({
//       success: true,
//       liked: true,
//       likeCount,
//       message: "Post liked successfully",
//     });
//   } catch (error) {
//     console.error("Toggle like error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update like",
//     });
//   }
// };

// /* ================================================================ */
// /* GET LIKE INFO                                                     */
// /* ================================================================ */

// const getLikeInfo = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user.userId;

//     /* ------------------------------------------------------------ */
//     /* GET LIKE COUNT                                                */
//     /* ------------------------------------------------------------ */

//     const likeCount = await Like.countDocuments({
//       post: postId,
//     });

//     /* ------------------------------------------------------------ */
//     /* CHECK USER LIKE                                               */
//     /* ------------------------------------------------------------ */

//     const userLike = await Like.findOne({
//       post: postId,
//       user: userId,
//     });

//     return res.status(200).json({
//       success: true,
//       likeCount,
//       liked: !!userLike,
//     });
//   } catch (error) {
//     console.error("Get like info error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch like information",
//     });
//   }
// };

// /* ================================================================ */
// /* EXPORTS                                                           */
// /* ================================================================ */

// module.exports = {
//   toggleLike,
//   getLikeInfo,
// };
// const Like = require("../models/like");
// const Post = require("../models/post");
// const Notification = require("../models/notification");

// /* ================================================================ */
// /* TOGGLE LIKE                                                       */
// /* ================================================================ */

// const toggleLike = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user.userId;

//     /* ------------------------------------------------------------ */
//     /* CHECK EXISTING LIKE                                           */
//     /* ------------------------------------------------------------ */

//     const existingLike = await Like.findOne({
//       post: postId,
//       user: userId,
//     });

//     /* ------------------------------------------------------------ */
//     /* UNLIKE                                                        */
//     /* ------------------------------------------------------------ */

//     if (existingLike) {
//       await Like.findByIdAndDelete(existingLike._id);

//       const likeCount = await Like.countDocuments({
//         post: postId,
//       });

//       return res.status(200).json({
//         success: true,
//         liked: false,
//         likeCount,
//         message: "Post unliked successfully",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CREATE LIKE                                                   */
//     /* ------------------------------------------------------------ */

//     await Like.create({
//       post: postId,
//       user: userId,
//     });

//     /* ------------------------------------------------------------ */
//     /* GET POST                                                      */
//     /* ------------------------------------------------------------ */

//     const post = await Post.findById(postId);

//     if (post) {
//       /* ---------------------------------------------------------- */
//       /* DON'T NOTIFY USER ABOUT THEIR OWN LIKE                    */
//       /* ---------------------------------------------------------- */

//       if (post.author.toString() !== userId.toString()) {
//         try {
//           /* ------------------------------------------------------ */
//           /* CREATE NOTIFICATION                                   */
//           /* ------------------------------------------------------ */

//           const notification = await Notification.create({
//             recipient: post.author,
//             sender: userId,
//             type: "like",
//             post: post._id,
//             message: "Someone liked your post",
//           });

//           console.log("Like notification created");

//           /* ------------------------------------------------------ */
//           /* SOCKET.IO REAL-TIME NOTIFICATION                      */
//           /* ------------------------------------------------------ */

//           try {
//             /*
//              * IMPORTANT:
//              * getIO() is called here, inside the request.
//              *
//              * Do NOT call getIO() at the top of this file.
//              */

//             const { getIO } = require("../socket/socket");

//             const io = getIO();

//             const receiverId = post.author.toString();
//             const roomName = `user:${receiverId}`;

//             console.log("========== LIKE SOCKET DEBUG ==========");
//             console.log("Receiver ID:", receiverId);
//             console.log("Target room:", roomName);

//             const room = io.sockets.adapter.rooms.get(roomName);

//             console.log("Room exists:", io.sockets.adapter.rooms.has(roomName));

//             console.log("Sockets in room:", room);

//             console.log("Socket count:", room ? room.size : 0);

//             /* -------------------------------------------------- */
//             /* SEND REAL-TIME NOTIFICATION                        */
//             /* -------------------------------------------------- */

//             io.to(roomName).emit("new-notification", notification);

//             console.log("EVENT EMITTED: new-notification");

//             console.log("======================================");
//           } catch (socketError) {
//             /*
//              * Socket failure should not make
//              * the like request fail.
//              */

//             console.error("Socket notification error:", socketError);
//           }
//         } catch (notificationError) {
//           /*
//            * Notification failure should not make
//            * the like request fail.
//            */

//           console.error("Create like notification error:", notificationError);
//         }
//       }
//     }

//     /* ------------------------------------------------------------ */
//     /* GET LIKE COUNT                                                */
//     /* ------------------------------------------------------------ */

//     const likeCount = await Like.countDocuments({
//       post: postId,
//     });

//     /* ------------------------------------------------------------ */
//     /* RESPONSE                                                      */
//     /* ------------------------------------------------------------ */

//     return res.status(201).json({
//       success: true,
//       liked: true,
//       likeCount,
//       message: "Post liked successfully",
//     });
//   } catch (error) {
//     console.error("Toggle like error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update like",
//     });
//   }
// };

// /* ================================================================ */
// /* GET LIKE INFO                                                     */
// /* ================================================================ */

// const getLikeInfo = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user.userId;

//     /* ------------------------------------------------------------ */
//     /* GET LIKE COUNT                                                */
//     /* ------------------------------------------------------------ */

//     const likeCount = await Like.countDocuments({
//       post: postId,
//     });

//     /* ------------------------------------------------------------ */
//     /* CHECK USER LIKE                                               */
//     /* ------------------------------------------------------------ */

//     const userLike = await Like.findOne({
//       post: postId,
//       user: userId,
//     });

//     /* ------------------------------------------------------------ */
//     /* RESPONSE                                                      */
//     /* ------------------------------------------------------------ */

//     return res.status(200).json({
//       success: true,
//       likeCount,
//       liked: !!userLike,
//     });
//   } catch (error) {
//     console.error("Get like info error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch like information",
//     });
//   }
// };

// /* ================================================================ */
// /* EXPORTS                                                           */
// /* ================================================================ */

// module.exports = {
//   toggleLike,
//   getLikeInfo,
// };
// const Like = require("../models/like");
// const Post = require("../models/post");
// const Notification = require("../models/notification");

// /* ================================================================ */
// /* TOGGLE LIKE                                                       */
// /* ================================================================ */

// const toggleLike = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user.userId;

//     /* ------------------------------------------------------------ */
//     /* CHECK EXISTING LIKE                                           */
//     /* ------------------------------------------------------------ */

//     const existingLike = await Like.findOne({
//       post: postId,
//       user: userId,
//     });

//     /* ------------------------------------------------------------ */
//     /* UNLIKE                                                        */
//     /* ------------------------------------------------------------ */

//     if (existingLike) {
//       await Like.findByIdAndDelete(existingLike._id);

//       const likeCount = await Like.countDocuments({
//         post: postId,
//       });

//       /* ---------------------------------------------------------- */
//       /* REAL-TIME UNLIKE UPDATE                                    */
//       /* ---------------------------------------------------------- */

//       try {
//         const { getIO } = require("../socket/socket");

//         const io = getIO();

//         io.to(`post:${postId}`).emit("post-liked", {
//           postId,
//           likeCount,
//           liked: false,
//         });

//         console.log("EVENT EMITTED: post-liked (unlike)");
//       } catch (socketError) {
//         console.error("Socket unlike update error:", socketError);
//       }

//       return res.status(200).json({
//         success: true,
//         liked: false,
//         likeCount,
//         message: "Post unliked successfully",
//       });
//     }

//     /* ------------------------------------------------------------ */
//     /* CREATE LIKE                                                   */
//     /* ------------------------------------------------------------ */

//     await Like.create({
//       post: postId,
//       user: userId,
//     });

//     /* ------------------------------------------------------------ */
//     /* GET POST                                                      */
//     /* ------------------------------------------------------------ */

//     const post = await Post.findById(postId);

//     if (post) {
//       /* ---------------------------------------------------------- */
//       /* DON'T NOTIFY USER ABOUT THEIR OWN LIKE                    */
//       /* ---------------------------------------------------------- */

//       if (post.author.toString() !== userId.toString()) {
//         try {
//           /* ------------------------------------------------------ */
//           /* CREATE NOTIFICATION                                   */
//           /* ------------------------------------------------------ */

//           const notification = await Notification.create({
//             recipient: post.author,
//             sender: userId,
//             type: "like",
//             post: post._id,
//             message: "Someone liked your post",
//           });

//           console.log("Like notification created");

//           /* ------------------------------------------------------ */
//           /* SOCKET.IO REAL-TIME EVENTS                             */
//           /* ------------------------------------------------------ */

//           try {
//             const { getIO } = require("../socket/socket");

//             const io = getIO();

//             const receiverId = post.author.toString();
//             const roomName = `user:${receiverId}`;

//             console.log("========== LIKE SOCKET DEBUG ==========");
//             console.log("Receiver ID:", receiverId);
//             console.log("Target user room:", roomName);
//             console.log("Target post room:", `post:${postId}`);

//             const userRoom = io.sockets.adapter.rooms.get(roomName);
//             const postRoom = io.sockets.adapter.rooms.get(`post:${postId}`);

//             console.log(
//               "User room exists:",
//               io.sockets.adapter.rooms.has(roomName),
//             );

//             console.log(
//               "User room socket count:",
//               userRoom ? userRoom.size : 0,
//             );

//             console.log(
//               "Post room exists:",
//               io.sockets.adapter.rooms.has(`post:${postId}`),
//             );

//             console.log(
//               "Post room socket count:",
//               postRoom ? postRoom.size : 0,
//             );

//             /* -------------------------------------------------- */
//             /* SEND REAL-TIME NOTIFICATION                        */
//             /* -------------------------------------------------- */

//             io.to(roomName).emit("new-notification", notification);

//             console.log("EVENT EMITTED: new-notification");

//             /* -------------------------------------------------- */
//             /* GET CURRENT LIKE COUNT                              */
//             /* -------------------------------------------------- */

//             const likeCount = await Like.countDocuments({
//               post: postId,
//             });

//             /* -------------------------------------------------- */
//             /* SEND REAL-TIME LIKE UPDATE TO POST ROOM             */
//             /* -------------------------------------------------- */

//             io.to(`post:${postId}`).emit("post-liked", {
//               postId,
//               likeCount,
//               liked: true,
//             });

//             console.log("EVENT EMITTED: post-liked");

//             console.log("======================================");
//           } catch (socketError) {
//             /*
//              * Socket failure should not make
//              * the like request fail.
//              */

//             console.error("Socket notification error:", socketError);
//           }
//         } catch (notificationError) {
//           /*
//            * Notification failure should not make
//            * the like request fail.
//            */

//           console.error("Create like notification error:", notificationError);
//         }
//       } else {
//         /* -------------------------------------------------------- */
//         /* OWN POST LIKE                                            */
//         /* -------------------------------------------------------- */

//         try {
//           const { getIO } = require("../socket/socket");

//           const io = getIO();

//           const likeCount = await Like.countDocuments({
//             post: postId,
//           });

//           io.to(`post:${postId}`).emit("post-liked", {
//             postId,
//             likeCount,
//             liked: true,
//           });

//           console.log("EVENT EMITTED: post-liked (own post)");
//         } catch (socketError) {
//           console.error("Socket like update error:", socketError);
//         }
//       }
//     }

//     /* ------------------------------------------------------------ */
//     /* GET LIKE COUNT                                                */
//     /* ------------------------------------------------------------ */

//     const likeCount = await Like.countDocuments({
//       post: postId,
//     });

//     /* ------------------------------------------------------------ */
//     /* RESPONSE                                                      */
//     /* ------------------------------------------------------------ */

//     return res.status(201).json({
//       success: true,
//       liked: true,
//       likeCount,
//       message: "Post liked successfully",
//     });
//   } catch (error) {
//     console.error("Toggle like error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update like",
//     });
//   }
// };

// /* ================================================================ */
// /* GET LIKE INFO                                                     */
// /* ================================================================ */

// const getLikeInfo = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user.userId;

//     /* ------------------------------------------------------------ */
//     /* GET LIKE COUNT                                                */
//     /* ------------------------------------------------------------ */

//     const likeCount = await Like.countDocuments({
//       post: postId,
//     });

//     /* ------------------------------------------------------------ */
//     /* CHECK USER LIKE                                               */
//     /* ------------------------------------------------------------ */

//     const userLike = await Like.findOne({
//       post: postId,
//       user: userId,
//     });

//     /* ------------------------------------------------------------ */
//     /* RESPONSE                                                      */
//     /* ------------------------------------------------------------ */

//     return res.status(200).json({
//       success: true,
//       likeCount,
//       liked: !!userLike,
//     });
//   } catch (error) {
//     console.error("Get like info error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch like information",
//     });
//   }
// };

// /* ================================================================ */
// /* EXPORTS                                                           */
// /* ================================================================ */

// module.exports = {
//   toggleLike,
//   getLikeInfo,
// };
const Like = require("../models/like");
const Post = require("../models/post");
const Notification = require("../models/notification");

/* ================================================================ */
/* TOGGLE LIKE                                                       */
/* ================================================================ */

const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    /* ------------------------------------------------------------ */
    /* CHECK EXISTING LIKE                                           */
    /* ------------------------------------------------------------ */

    const existingLike = await Like.findOne({
      post: postId,
      user: userId,
    });

    /* ============================================================ */
    /* UNLIKE                                                        */
    /* ============================================================ */

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);

      const likeCount = await Like.countDocuments({
        post: postId,
      });

      /* ---------------------------------------------------------- */
      /* REAL-TIME UNLIKE UPDATE                                    */
      /* ---------------------------------------------------------- */

      try {
        const { getIO } = require("../socket/socket");

        const io = getIO();

        io.to(`post:${postId}`).emit("like-updated", {
          postId,
          likeCount,
        });

        console.log("EVENT EMITTED: like-updated (unlike)");
        console.log("Post ID:", postId);
        console.log("Like count:", likeCount);
      } catch (socketError) {
        /*
         * Socket failure should not make
         * the unlike request fail.
         */

        console.error("Socket unlike update error:", socketError);
      }

      /* ---------------------------------------------------------- */
      /* RESPONSE                                                    */
      /* ---------------------------------------------------------- */

      return res.status(200).json({
        success: true,
        liked: false,
        likeCount,
        message: "Post unliked successfully",
      });
    }

    /* ============================================================ */
    /* CREATE LIKE                                                   */
    /* ============================================================ */

    await Like.create({
      post: postId,
      user: userId,
    });

    /* ------------------------------------------------------------ */
    /* GET POST                                                      */
    /* ------------------------------------------------------------ */

    const post = await Post.findById(postId);

    /* ------------------------------------------------------------ */
    /* GET CURRENT LIKE COUNT                                       */
    /* ------------------------------------------------------------ */

    const likeCount = await Like.countDocuments({
      post: postId,
    });

    /* ============================================================ */
    /* REAL-TIME LIKE UPDATE                                        */
    /* ============================================================ */

    try {
      const { getIO } = require("../socket/socket");

      const io = getIO();

      const postRoomName = `post:${postId}`;

      console.log("========== LIKE SOCKET DEBUG ==========");
      console.log("Post ID:", postId);
      console.log("Post room:", postRoomName);

      const postRoom = io.sockets.adapter.rooms.get(postRoomName);

      console.log(
        "Post room exists:",
        io.sockets.adapter.rooms.has(postRoomName),
      );

      console.log("Post room socket count:", postRoom ? postRoom.size : 0);

      /* ---------------------------------------------------------- */
      /* SEND REAL-TIME LIKE UPDATE                                 */
      /* ---------------------------------------------------------- */

      io.to(postRoomName).emit("like-updated", {
        postId,
        likeCount,
      });

      console.log("EVENT EMITTED: like-updated");
      console.log("Like count:", likeCount);

      console.log("======================================");
    } catch (socketError) {
      /*
       * Socket failure should not make
       * the like request fail.
       */

      console.error("Socket like update error:", socketError);
    }

    /* ============================================================ */
    /* CREATE NOTIFICATION                                          */
    /* ============================================================ */

    if (post) {
      /* ---------------------------------------------------------- */
      /* DON'T NOTIFY USER ABOUT THEIR OWN LIKE                    */
      /* ---------------------------------------------------------- */

      if (post.author.toString() !== userId.toString()) {
        try {
          /* ------------------------------------------------------ */
          /* CREATE NOTIFICATION                                   */
          /* ------------------------------------------------------ */

          const notification = await Notification.create({
            recipient: post.author,
            sender: userId,
            type: "like",
            post: post._id,
            message: "Someone liked your post",
          });

          console.log("Like notification created");

          /* ------------------------------------------------------ */
          /* SEND REAL-TIME NOTIFICATION                            */
          /* ------------------------------------------------------ */

          try {
            const { getIO } = require("../socket/socket");

            const io = getIO();

            const receiverId = post.author.toString();

            const roomName = `user:${receiverId}`;

            console.log("========== NOTIFICATION SOCKET DEBUG ==========");

            console.log("Receiver ID:", receiverId);

            console.log("Target user room:", roomName);

            const userRoom = io.sockets.adapter.rooms.get(roomName);

            console.log(
              "User room exists:",
              io.sockets.adapter.rooms.has(roomName),
            );

            console.log(
              "User room socket count:",
              userRoom ? userRoom.size : 0,
            );

            /* -------------------------------------------------- */
            /* SEND NOTIFICATION                                  */
            /* -------------------------------------------------- */

            io.to(roomName).emit("new-notification", notification);

            console.log("EVENT EMITTED: new-notification");

            console.log("===============================================");
          } catch (socketError) {
            /*
             * Socket failure should not make
             * the like request fail.
             */

            console.error("Socket notification error:", socketError);
          }
        } catch (notificationError) {
          /*
           * Notification failure should not make
           * the like request fail.
           */

          console.error("Create like notification error:", notificationError);
        }
      }
    }

    /* ============================================================ */
    /* RESPONSE                                                      */
    /* ============================================================ */

    return res.status(201).json({
      success: true,
      liked: true,
      likeCount,
      message: "Post liked successfully",
    });
  } catch (error) {
    console.error("Toggle like error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update like",
    });
  }
};

/* ================================================================ */
/* GET LIKE INFO                                                     */
/* ================================================================ */

const getLikeInfo = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    /* ------------------------------------------------------------ */
    /* GET LIKE COUNT                                                */
    /* ------------------------------------------------------------ */

    const likeCount = await Like.countDocuments({
      post: postId,
    });

    /* ------------------------------------------------------------ */
    /* CHECK USER LIKE                                               */
    /* ------------------------------------------------------------ */

    const userLike = await Like.findOne({
      post: postId,
      user: userId,
    });

    /* ------------------------------------------------------------ */
    /* RESPONSE                                                      */
    /* ------------------------------------------------------------ */

    return res.status(200).json({
      success: true,
      likeCount,
      liked: !!userLike,
    });
  } catch (error) {
    console.error("Get like info error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch like information",
    });
  }
};

/* ================================================================ */
/* EXPORTS                                                           */
/* ================================================================ */

module.exports = {
  toggleLike,
  getLikeInfo,
};
