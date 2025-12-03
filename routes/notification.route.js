import { getNotifications, triggerLikeNotification } from "../controller/notification.controller.js";
import exoress from 'express'
import { authMiddleware } from "../utility/auth.Middleware.js";

const router=exoress.Router();


router.post("/like",authMiddleware,triggerLikeNotification);
router.get("/getNotifications",authMiddleware,getNotifications);

export default router;