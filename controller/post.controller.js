import mongoose from "mongoose";
import { Post } from "../schemas/Post.schema.js";


export const createPost = async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        // const id=req.user._id
        console.log(req.user[0]._id);
        
        const { text } = req.body;
        if(!user || !text){
            return res.status(400).json({message:"all fields are required"});
        }
        
        
        const post = await Post.create({ user:req.user[0]._id,text });
        res.status(201).json({message:"Post created successfully",post});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likePost=async(req,res)=>{
    try {
        const user = req.user;
        const {id}=req.params;
        const post=await Post.findById(id);
        if(!post){
            return res.status(400).json({message:"post not found"});
        }
        post.likes.push(user[0]._id);
        await post.save();
        res.status(200).json({message:"post liked successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}