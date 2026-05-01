import User from "../models/userSchema.js";
import Contact from "../models/contactSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const userSignUp = async (req, res) => {
    console.log(req.body);
    try {
        const { username, password, email, name } = req.body;

        const userExist = await User.findOne({ username });
        if (userExist) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, name, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const userLogin = async (req, res) => {
    console.log(req.body);
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            // secure: false,
            // sameSite: "lax",
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        // sameSite: "lax",
        // secure: false,
        secure: true,
        sameSite: "none",
        path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
};

export const aboutData = async (req, res) => {
    // console.log(req);
    res.status(200).json({
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        name: req.user.name,
    });
}


export const contactData = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();

        res.status(200).json({ message: "Contact saved successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}