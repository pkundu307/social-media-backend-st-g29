
import { Post } from "../schemas/Post.schema.js";
import cloudinary from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

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

        const user = req.user[0]._id;
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
    const user = req.user;
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    post.likes.push(user[0]._id);
    await post.save();
    res.status(200).json({ message: "post liked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
