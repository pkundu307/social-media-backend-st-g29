import { createPost,likePost } from "../controller/post.controller.js";
import express from 'express'
import { authMiddleware } from "../utility/auth.Middleware.js";

const router = express.Router();

router.post("/create",authMiddleware,createPost)
router.post("/like/:id",authMiddleware,likePost)

export default router