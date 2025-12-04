
import { Post } from "../schemas/Post.schema.js";
import cloudinary from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import { Notification } from "../schemas/notification.schema.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type:'auto'
      },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
    );
    stream.end(buffer);
  });
}

const storage = multer.memoryStorage();
export const upload = (fieldName) =>
  multer({ storage: storage }).single(fieldName);
export const createPost = async (req, res) => {
    try {
        let imageUrl = null;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
            console.log("Uploaded file:", imageUrl);
        }

        const user = req.user._id;
        const { text } = req.body;
        // handleUpload(req.file);
        if (!text) {
            return res.status(400).json({ message: "Text is required" });
        }

        const post = await Post.create({
            user,
            text,
            image: imageUrl
        });

        return res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};


export const likePost = async (req, res) => {
  try {
 const userId=req.user._id;
     const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    post.likes.push(userId);
    await post.save();
            const newNotification=await Notification.create({
                to:post.user,
                from:userId,
                type:"like",
                post:post._id
            });


    res.status(200).json({ message: "post liked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ user: userId,isDeleted:false })
    .limit(5)
    .populate(
      "user",
      "username email profilePic"
    ).sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
  console.error(error);
  res.status(500).json({ message: error.message });   
  }
}
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;         
    const userId = req.user._id;       
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not allowed to delete this post" });
    }
    if (post.isDeleted) {
      return res.status(404).json({ message: "Post is already deleted" });
    }
    if (post.image) {
      const publicId = post.image
        .split("/")
        .pop()
        .split(".")[0]; 

      try {
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (err) {
        console.log("Cloudinary delete failed (not critical)", err.message);
      }
    }
    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();

    return res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
