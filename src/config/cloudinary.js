// const { v2: cloudinary } = require("cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// module.exports = cloudinary;
// const { v2: cloudinary } = require("cloudinary");

// console.log("Cloud Name exists:", !!process.env.CLOUDINARY_CLOUD_NAME);

// console.log("API Key exists:", !!process.env.CLOUDINARY_API_KEY);

// console.log("API Secret exists:", !!process.env.CLOUDINARY_API_SECRET);

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// module.exports = cloudinary;
const path = require("path");
const dotenv = require("dotenv");
const { v2: cloudinary } = require("cloudinary");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log("Cloud Name exists:", !!process.env.CLOUDINARY_CLOUD_NAME);

console.log("API Key exists:", !!process.env.CLOUDINARY_API_KEY);

console.log("API Secret exists:", !!process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
