import express from 'express'
import connectToDatabase  from './utility/dbConnect.js'
import userRouter from "./routes/user.route.js"
const server = express()
//json support
server.use(express.json())


server.get('/',(req,res)=>{
    res.send("welcome from the 1st api")
})

server.use("/api/user",userRouter)
connectToDatabase();



const port = 5000;
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})