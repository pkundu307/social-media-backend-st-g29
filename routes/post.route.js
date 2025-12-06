import { createPost,getMyPosts,likePost,upload,deletePost,restorePost } from "../controller/post.controller.js";
import express from 'express'
import { authMiddleware } from "../utility/auth.Middleware.js";

const router = express.Router();

router.post("/create",authMiddleware,upload("image"),createPost)
router.post("/like/:id",authMiddleware,likePost)
router.get("/myposts",authMiddleware,getMyPosts)
router.delete("/delete/:id", authMiddleware, deletePost);
router.put("/restore/:id", authMiddleware, restorePost);

export default router