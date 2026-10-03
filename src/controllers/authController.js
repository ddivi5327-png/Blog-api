// const bcrypt = require("bcryptjs");
// const User = require("../models/User");

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check required fields
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, email and password are required",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Registration failed",
//     });
//   }
// };
// const jwt = require("jsonwebtoken");

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check required fields
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     // Find user
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // Compare password
//     const isPasswordCorrect = await bcrypt.compare(password, user.password);

//     if (!isPasswordCorrect) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // Create JWT
//     const token = jwt.sign(
//       {
//         userId: user._id,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       },
//     );

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Login failed",
//     });
//   }
// };
// const updateProfile = async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and email are required",
//       });
//     }

//     const user = await User.findById(req.user.userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const existingUser = await User.findOne({
//       email,
//       _id: { $ne: user._id },
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     user.name = name.trim();
//     user.email = email.trim();

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error("Update profile error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Profile update failed",
//     });
//   }
// };
// module.exports = {
//   registerUser,
//   loginUser,
//   updateProfile,
// };
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

/* ================================================================ */
/* REGISTER                                                         */
/* ================================================================ */

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
        profileImageWidth: user.profileImageWidth ?? null,
        profileImageHeight: user.profileImageHeight ?? null,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

/* ================================================================ */
/* LOGIN                                                            */
/* ================================================================ */

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
        profileImageWidth: user.profileImageWidth ?? null,
        profileImageHeight: user.profileImageHeight ?? null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/* ================================================================ */
/* UPDATE PROFILE                                                   */
/* ================================================================ */

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      profileImageWidth,
      profileImageHeight,
      removeProfileImage,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingUser = await User.findOne({
      email: email.trim(),
      _id: {
        $ne: user._id,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    /* ------------------------------------------------------------ */
    /* BASIC PROFILE DATA                                           */
    /* ------------------------------------------------------------ */

    user.name = name.trim();
    user.email = email.trim();

    /* ------------------------------------------------------------ */
    /* REMOVE PROFILE IMAGE                                         */
    /* ------------------------------------------------------------ */

    if (removeProfileImage === "true") {
      user.profileImage = "";
      user.profileImageWidth = null;
      user.profileImageHeight = null;
    }

    /* ------------------------------------------------------------ */
    /* UPLOAD PROFILE IMAGE                                         */
    /* ------------------------------------------------------------ */

    if (req.file) {
      console.log("Profile image received:", req.file.originalname);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "blog-profiles",
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

      user.profileImage = result.secure_url;

      user.profileImageWidth = profileImageWidth
        ? Number(profileImageWidth)
        : null;

      user.profileImageHeight = profileImageHeight
        ? Number(profileImageHeight)
        : null;

      console.log("Profile image URL:", user.profileImage);
    }

    /* ------------------------------------------------------------ */
    /* SAVE                                                          */
    /* ------------------------------------------------------------ */

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
        profileImageWidth: user.profileImageWidth ?? null,
        profileImageHeight: user.profileImageHeight ?? null,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};

/* ================================================================ */
/* EXPORTS                                                          */
/* ================================================================ */

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
};
