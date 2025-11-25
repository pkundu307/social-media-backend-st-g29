import friendRequestSchema from "../schemas/friendRequest.schema.js";

export const sendFriendRequest = async (req, res) => {
    try {
        console.log(req,'kpkpkp');
        
        const sender = req.user._id;
        // console.log(sender,'sender');
        
        const { receiver } = req.body;
        // console.log(receiver);
        
        if (sender === receiver) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }
        const receiverUser = await friendRequestSchema.findOne({ to: receiver, from: sender });
        if (receiverUser) {
            return res.status(400).json({ message: "Friend request already sent" });
        }
        const receiverDetails = await friendRequestSchema.findById(receiver);
        console.log(receiverDetails);

        
       
        const friendRequest = await friendRequestSchema.create({    
            from:sender,
            to:receiver,
            status: "pending"
        });
        res.status(201).json({ message: "Friend request sent successfully", friendRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   ;
        