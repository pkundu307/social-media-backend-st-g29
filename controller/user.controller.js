import cloudinary from "../utility/cloudinary.js";
import UserSchema from "../schemas/User.schema.js";
import friendRequestSchema from "../schemas/friendRequest.schema.js";
import { Post } from "../schemas/Post.schema.js";

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "profile_pics",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export const uploadProfilePic = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const updatedUser = await UserSchema.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    );

    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const getMyProfileData=async(req,res)=>{
  try {
    const userId=req.user._id;
    const user=await UserSchema.findById(userId).select("-password");

    const totalFriends= await friendRequestSchema.countDocuments({
      $or:[{from:userId},{to:userId}],
      status:"accepted"
    })

    const pendingRequests= await friendRequestSchema.countDocuments({
      to:userId,
      status:"pending"
    })
    user.totalFriends=totalFriends;
    user.pendingRequests=pendingRequests;
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    res.status(200).json({
      success:true,
      user:req.user,
      counts:{
        friends:totalFriends,
        pendingRequests:pendingRequests
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }}
  
  export const getUserWithPosts = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch user details
    const user = await UserSchema.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Count total friends
    const totalFriends = await friendRequestSchema.countDocuments({
      $or: [{ from: id }, { to: id }],
      status: "accepted",
    });

    // 3. Count pending requests (for that user)
    const pendingRequests = await friendRequestSchema.countDocuments({
      to: id,
      status: "pending",
    });

    // 4. Fetch latest 10 posts
    const posts = await Post.find({ user: id, isDeleted: false })
      .limit(10)
      .populate("user", "username email profilePic")
      .sort({ createdAt: -1 });

    // 5. Return response
    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        totalFriends,
        pendingRequests,
      },
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};