import { login, register, searchUser } from "../controller/auth.controller.js"
import express from 'express'
import { uploadProfilePic } from "../controller/user.controller.js";
import {authMiddleware} from "../utility/auth.Middleware.js";
import { upload } from "../utility/multer.js";

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.get("/search/:name",searchUser)

router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("profilePic"),
  uploadProfilePic
);
export default router;