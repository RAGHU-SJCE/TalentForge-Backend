const Notification = require(
  "../models/Notification"
);

// Get Notifications
const getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await Notification.find({
        recipient: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark As Read
const markAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          recipient:
            req.user.id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Notification
const deleteNotification =
  async (req, res) => {
    try {
      const notification =
        await Notification.findOneAndDelete(
          {
            _id: req.params.id,
            recipient:
              req.user.id,
          }
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Notification deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// Mark All As Read
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Unread Count (for badge)
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
  markAllRead,
  getUnreadCount,
};