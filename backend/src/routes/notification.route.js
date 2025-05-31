import express from "express";
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getUnreadNotificationCount, getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../controllers/notification.controller.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/", authMiddleware, getUserNotifications)
notificationRoutes.get("/unread", authMiddleware, getUnreadNotificationCount)
notificationRoutes.put("/:notificationId/read", authMiddleware, markNotificationAsRead)
notificationRoutes.put("/read-all", authMiddleware, markAllNotificationsAsRead)

export default notificationRoutes