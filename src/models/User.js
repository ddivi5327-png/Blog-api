// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     profileImage: {
//       type: String,
//       default: "",
//     },

//     profileImageWidth: {
//       type: Number,
//       default: null,
//     },

//     profileImageHeight: {
//       type: Number,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// const User = mongoose.model("User", userSchema);

// module.exports = User;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profileImage: {
      type: String,
      default: "",
    },

    profileImageWidth: {
      type: Number,
      default: null,
    },

    profileImageHeight: {
      type: Number,
      default: null,
    },

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
