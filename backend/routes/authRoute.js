import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/signup", async (req, res) => {
    console.log("Signup");
    const { FirstName, LastName, username, password } = req.body;

    console.log(FirstName, LastName, username, password);

    if (!username || !password || !FirstName || !LastName) {
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
        FirstName,
        LastName,
        username,
        password: hash,
        numItemsOwned: 10,
    });
    try {
        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username already exists",
            });
        }

        const newUser = await user.save();
        console.log("New User created");
        return res.json({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        console.log("Error creating user", error);
        return res
            .status(400)
            .json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Username",
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.json({
                success: false,
                message: "Invalid Password",
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_JWT, {
            expiresIn: "7d",
        });

        return res.status(200).cookie("token", token, {
            httpOnly: false,
            // secure: ,
            // sameSite: "none",
            // path: "/",
            // maxAge: 1000 * 60 * 60 * 24 * 7,
        }).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                FirstName: user.FirstName,
                LastName: user.LastName,
                username: user.username,
                token: token,
                cash: user.cash,
            },
        });
    } catch (error) {
        console.log("Error logging in user", error);
        return res
            .status(400)
            .json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/update-password", async (req, res) => {
    const { id, password, newPassword } = req.body;

    console.log("id", id);
    console.log("password", password);
    console.log("new", newPassword);

    if (!id || !password || !newPassword) {
        console.log("All fields are required.");
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    try {
        const user = await User.findById(id);
        console.log("User", user);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid User",
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password",
            });
        }

        const hash = await bcrypt.hash(newPassword, 10);

        user.password = hash;

        await user.save();

        return res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.log("Error updating password", error);
        return res
            .status(400)
            .json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/logout", async (req, res) => {
    console.log("Inside logout")
    return res.clearCookie("token").json({
        success:true,
        message: "User logged out."
    })
});

export { router };
