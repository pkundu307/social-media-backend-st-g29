import { getNotifications, triggerLikeNotification, markAllNotificationsAsRead, markNotificationAsRead } from "../controller/notification.controller.js";
import exoress from 'express'
import { authMiddleware } from "../utility/auth.Middleware.js";

const router=exoress.Router();


router.post("/like",authMiddleware,triggerLikeNotification);
router.get("/getNotifications",authMiddleware,getNotifications);

router.put("/mark/:notificationId", authMiddleware, markNotificationAsRead);
router.put("/markAll", authMiddleware, markAllNotificationsAsRead);

export default router;