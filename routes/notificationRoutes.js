const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markAsRead,
  deleteNotification,
  markAllRead,
  getUnreadCount,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/mark-all-read", protect, markAllRead);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification Management APIs
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 */
router.get(
  "/",
  protect,
  getNotifications
);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.put(
  "/:id/read",
  protect,
  markAsRead
);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 */
router.delete(
  "/:id",
  protect,
  deleteNotification
);

module.exports = router;