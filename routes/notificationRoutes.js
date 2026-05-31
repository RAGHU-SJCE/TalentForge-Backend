const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require(
  "../controllers/notificationController"
);

const {
  protect,
} = require("../middleware/authMiddleware");

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