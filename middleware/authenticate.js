import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

const authenticate = async (req, res, next) => {
    try {
        // console.log("Cookies:", req.cookies);
        const token = req.cookies?.token;
        // console.log("Token:", token);
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log("Decoded:", decoded);
        const user = await User.findById(decoded._id);
        // console.log("User:", user)
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid token" });
    }
}

export default authenticate;