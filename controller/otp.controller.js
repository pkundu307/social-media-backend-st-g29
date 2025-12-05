import { OTP } from "../schemas/otp.schema.js";
import nodemailer from "nodemailer";
import UserSchema from "../schemas/User.schema.js";

export const createOTP = async (req, res) => {
  try {
    console.log("Check");

    const { email } = req.body;
    console.log("Email received for OTP:", email);

    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP entry
    await OTP.create({
      email,
      otp: generatedOTP,
      createdAt: Date.now(),
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "",
        pass: "", 
      },
    });

    const info = await transporter.sendMail({
      from: "pkundu307@gmail.com",
      to: email, // FIXED
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: <b>${generatedOTP}</b></h2>`,
    });

    console.log("Message sent: %s", info.messageId);

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("Error creating OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
