import jwt from "jsonwebtoken";
import UserSchema from "../schemas/User.schema.js";


export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = jwt.verify(token, "prasanna");
        console.log(decodedToken);
        
        const user = await UserSchema.find({ email: decodedToken.email });
        console.log(user);
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}