import { sendFriendRequest } from "../controller/friendrequest.controller.js";
import express from 'express'
import { authMiddleware } from "../utility/auth.Middleware.js";

const router = express.Router();

router.post("/send",authMiddleware,sendFriendRequest)

export default router