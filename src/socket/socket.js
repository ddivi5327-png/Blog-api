// const { Server } = require("socket.io");

// let io;

// const initializeSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST", "PUT", "DELETE"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     socket.on("join-user", (userId) => {
//       if (!userId) return;

//       socket.join(userId);
//       console.log(`User ${userId} joined socket room`);
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", socket.id);
//     });
//   });

//   return io;
// };

// const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.io has not been initialized");
//   }

//   return io;
// };

// module.exports = {
//   initializeSocket,
//   getIO,
// };

// const { Server } = require("socket.io");

// let io;

// const initializeSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST", "PUT", "DELETE"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     /* ============================================================ */
//     /* JOIN USER ROOM                                                 */
//     /* ============================================================ */

//     socket.on("join-user", (userId) => {
//       if (!userId) return;

//       socket.join(`user:${userId}`);

//       console.log(`User ${userId} joined user room`);
//     });

//     /* ============================================================ */
//     /* JOIN POST ROOM                                                 */
//     /* ============================================================ */

//     socket.on("join-post", (postId) => {
//       if (!postId) return;

//       socket.join(`post:${postId}`);

//       console.log(`Socket ${socket.id} joined post room ${postId}`);
      
//     });

//     /* ============================================================ */
//     /* LEAVE POST ROOM                                                */
//     /* ============================================================ */

//     socket.on("leave-post", (postId) => {
//       if (!postId) return;

//       socket.leave(`post:${postId}`);

//       console.log(`Socket ${socket.id} left post room ${postId}`);
//     });

//     /* ============================================================ */
//     /* DISCONNECT                                                     */
//     /* ============================================================ */

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", socket.id);
//     });
//   });

//   return io;
// };

// const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.io has not been initialized");
//   }

//   return io;
// };

// module.exports = {
//   initializeSocket,
//   getIO,
// };
// const { Server } = require("socket.io");

// let io;

// const initializeSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST", "PUT", "DELETE"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     /* ============================================================ */
//     /* JOIN USER ROOM                                                */
//     /* ============================================================ */

//     socket.on("join-user", (userId) => {
//       if (!userId) return;

//       socket.join(`user:${userId}`);

//       console.log(`User ${userId} joined user room`);
//     });

//     /* ============================================================ */
//     /* NOTIFICATION READ                                             */
//     /* ============================================================ */

//     socket.on("notification-read", (notificationId) => {
//       if (!notificationId) return;

//       console.log(`Notification ${notificationId} marked as read`);

//       socket.emit("notification-read", notificationId);
//     });

//     /* ============================================================ */
//     /* JOIN POST ROOM                                                */
//     /* ============================================================ */

//     socket.on("join-post", (postId) => {
//       if (!postId) return;

//       socket.join(`post:${postId}`);

//       console.log(`Socket ${socket.id} joined post room ${postId}`);
//     });

//     /* ============================================================ */
//     /* LEAVE POST ROOM                                               */
//     /* ============================================================ */

//     socket.on("leave-post", (postId) => {
//       if (!postId) return;

//       socket.leave(`post:${postId}`);

//       console.log(`Socket ${socket.id} left post room ${postId}`);
//     });

//     /* ============================================================ */
//     /* DISCONNECT                                                    */
//     /* ============================================================ */

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", socket.id);
//     });
//   });

//   return io;
// };

// const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.io has not been initialized");
//   }

//   return io;
// };

// module.exports = {
//   initializeSocket,
//   getIO,
// };
const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /* ============================================================ */
    /* JOIN USER ROOM                                                */
    /* ============================================================ */

    socket.on("join-user", (userId) => {
      if (!userId) return;

      socket.join(`user:${userId}`);

      console.log(`User ${userId} joined user room`);
    });

    /* ============================================================ */
    /* NOTIFICATION READ                                             */
    /* ============================================================ */

    socket.on("notification-read", (notificationId) => {
      if (!notificationId) return;

      console.log(`Notification ${notificationId} marked as read`);

      io.emit("notification-read", notificationId);
    });

    /* ============================================================ */
    /* JOIN POST ROOM                                                */
    /* ============================================================ */

    socket.on("join-post", (postId) => {
      if (!postId) return;

      socket.join(`post:${postId}`);

      console.log(`Socket ${socket.id} joined post room ${postId}`);
    });

    /* ============================================================ */
    /* LEAVE POST ROOM                                               */
    /* ============================================================ */

    socket.on("leave-post", (postId) => {
      if (!postId) return;

      socket.leave(`post:${postId}`);

      console.log(`Socket ${socket.id} left post room ${postId}`);
    });

    /* ============================================================ */
    /* DISCONNECT                                                    */
    /* ============================================================ */

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }

  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};