// const express = require("express");
// const {
//   registerUser,
//   loginUser,
//   updateProfile,
// } = require("../controllers/authController");
// const protect = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.put("/profile", protect, updateProfile);

// module.exports = router;
const express = require("express");

const {
  registerUser,
  loginUser,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/profile", protect, upload.single("profileImage"), updateProfile);

module.exports = router;
