import { login, register, searchUser } from "../controller/auth.controller.js"
import express from 'express'

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.get("/search/:name",searchUser)
export default router;