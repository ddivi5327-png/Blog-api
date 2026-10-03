const express = require("express");

const {
  createNotification,
  getNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* Get notifications of logged-in user */
router.get("/", protect, getNotifications);

/* Create notification */
router.post("/", protect, createNotification);

/* Mark notification as read */
router.put("/:id/read", protect, markNotificationAsRead);

module.exports = router;
