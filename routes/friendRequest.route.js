import { acceptOrRejectRequest, getFriendRequests, sendFriendRequest } from "../controller/friendrequest.controller.js";
import express from 'express'
import { authMiddleware } from "../utility/auth.Middleware.js";

const router = express.Router();

router.post("/send",authMiddleware,sendFriendRequest)
router.get("/getfriendrequests",authMiddleware,getFriendRequests)
router.post("/stauschange",authMiddleware,acceptOrRejectRequest)

export default router