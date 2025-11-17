import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const connectToDatabase =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database connected")
    } catch (error) {
        console.log(error)
    }
}

export default connectToDatabase