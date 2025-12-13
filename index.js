import express from 'express'
import connectToDatabase  from './utility/dbConnect.js'
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import friendRequestRouter from "./routes/friendRequest.route.js"
import notificationRouter from "./routes/notification.route.js"
import otpRouter from "./routes/otp.route.js"
import cors from 'cors';


const server = express()
//json support
server.use(express.json())
server.use(cors())

server.get('/',(req,res)=>{
    res.send("welcome from the 1st api")
})

server.use("/api/user",userRouter)
server.use("/api/post",postRouter)
server.use("/api/friendrequest",friendRequestRouter)
server.use("/api/notification",notificationRouter)
server.use("/api/otp",otpRouter)
connectToDatabase();


const port = process.env.PORT||5000;
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})