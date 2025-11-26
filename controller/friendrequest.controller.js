import friendRequestSchema from "../schemas/friendRequest.schema.js";

export const sendFriendRequest = async (req, res) => {
  try {
    // console.log(req, "kpkpkp");

    const sender = req.user._id;
    // console.log(sender,'sender');

    const { receiver } = req.body;
    // console.log(receiver);

    if (sender === receiver) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }
    const receiverUser = await friendRequestSchema.findOne({
      to: receiver,
      from: sender,
    });
    if (receiverUser) {
      return res.status(400).json({ message: "Friend request already sent" });
    }
    const receiverDetails = await friendRequestSchema.findById(receiver);
    console.log(receiverDetails);

    const friendRequest = await friendRequestSchema.create({
      from: sender,
      to: receiver,
      status: "pending",
    });
    res
      .status(201)
      .json({ message: "Friend request sent successfully", friendRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all friendRequests to me -> friendrequests which i received
//get friend requests from me-> friendrequests which i sent
export const getFriendRequests = async (req, res) => {
  try {
    const user = req.user._id;
    const friendRequests = await friendRequestSchema
      .find({ to: user })
      .populate("from", "username email")
      .populate("to", "username email");

    if (friendRequests.length === 0) {
      return res.status(200).json({ message: "No Friend Requests Found" });
    }
    res.status(200).json({ friendRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// accept or reject friend request

export const acceptOrRejectRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId, status } = req.body;

    const requestExist = await friendRequestSchema.findById(requestId);

    if (!requestExist) {
      return res.status(404).json({ message: "Request not found" });
    }

    // ---------------------
    // Validate authorization
    // ---------------------
    if (requestExist.to.toString() !== userId.toString()) {
      return res.status(400).json({
        message: "You are not authorized to accept or reject this request",
      });
    }

    // ---------------------
    // Update status
    // ---------------------
    requestExist.status = status;
    await requestExist.save(); // save FIRST

    // ---------------------
    // Send response ONCE
    // ---------------------
    if (status === "accepted") {
      return res.status(200).json({
        message: "Friend request accepted successfully",
        request: requestExist,
      });
    } else {
      return res.status(200).json({
        message: "Friend request rejected successfully",
        request: requestExist,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
