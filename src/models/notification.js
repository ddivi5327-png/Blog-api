// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema(
//   {
//     recipient: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     type: {
//       type: String,
//       enum: ["comment", "like"],
//       required: true,
//     },

//     post: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Post",
//       required: true,
//     },

//     message: {
//       type: String,
//       required: true,
//     },

//     isRead: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// //module.exports = mongoose.model("Notification", notificationSchema);
// mongoose.models.Notification ||
//   mongoose.model("Notification", notificationSchema);
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["comment", "like"],
      required: true,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);