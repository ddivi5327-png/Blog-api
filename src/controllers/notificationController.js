const Notification = require("../models/notification");

const createNotification = async (req, res) => {
  try {
    const { recipient, sender, type, post, message } = req.body;

    if (!recipient || !sender || !type || !post || !message) {
      return res.status(400).json({
        success: false,
        message: "Recipient, sender, type, post and message are required",
      });
    }

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      post,
      message,
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate("sender", "name email")
      .populate("post", "title");

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification: populatedNotification,
    });
  } catch (error) {
    console.error("Create notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create notification",
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.userId,
    })
      .populate("sender", "name email")
      .populate("post", "title")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user.userId,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
};
