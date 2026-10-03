// const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema(
//   {
//     post: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Post",
//       required: true,
//     },

//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     text: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// module.exports = mongoose.model("Comment", commentSchema);
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    // null = main comment
    // comment ID = reply to that comment
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Comment", commentSchema);
