// const dotenv = require("dotenv");
// const express = require("express");
// const cors = require("cors");
// //const dotenv = require("dotenv");

// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const postRoutes = require("./routes/postRoutes");
// const commentRoutes = require("./routes/commentRoutes");
// const likeRoutes = require("./routes/likeRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");
// dotenv.config();

// connectDB();

// const app = express();
// console.log(typeof postRoutes);
// app.use(cors());
// app.use(express.json());
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/likes", likeRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.get("/", (req, res) => {
//   res.json({
//     message: "Blog API is running",
//   });
// });

// const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on port ${PORT}`);
// });

// const dotenv = require("dotenv");
// const express = require("express");
// const cors = require("cors");

// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const postRoutes = require("./routes/postRoutes");
// const commentRoutes = require("./routes/commentRoutes");
// const likeRoutes = require("./routes/likeRoutes");

// dotenv.config();

// connectDB();

// const app = express();

// /* -------------------------------------------------------------- */
// /* CHECK ROUTE TYPES                                               */
// /* -------------------------------------------------------------- */

// console.log("authRoutes:", typeof authRoutes);
// console.log("postRoutes:", typeof postRoutes);
// console.log("commentRoutes:", typeof commentRoutes);
// console.log("likeRoutes:", typeof likeRoutes);

// /* -------------------------------------------------------------- */
// /* MIDDLEWARE                                                       */
// /* -------------------------------------------------------------- */

// app.use(cors());

// app.use(express.json());

// /* -------------------------------------------------------------- */
// /* ROUTES                                                           */
// /* -------------------------------------------------------------- */

// app.use("/api/auth", authRoutes);

// app.use("/api/posts", postRoutes);

// app.use("/api/comments", commentRoutes);

// app.use("/api/likes", likeRoutes);

// /* -------------------------------------------------------------- */
// /* TEST ROUTE                                                       */
// /* -------------------------------------------------------------- */

// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Blog API is running",
//   });
// });

// /* -------------------------------------------------------------- */
// /* SERVER                                                           */
// /* -------------------------------------------------------------- */

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on port ${PORT}`);
// });
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const { initializeSocket } = require("./socket/socket");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Blog API is running",
  });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Port
const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
