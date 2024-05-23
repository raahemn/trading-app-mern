import express from "express";
import Trade from "../models/tradeModel.js";
import User from "../models/userModel.js";
import Offer from "../models/offerModel.js";

const router = express.Router();

router.post("/create-new-trade", async (req, res) => {
    const { id, title, description, conditions } = req.body;

    console.log("id", id);
    console.log("title", title);
    console.log("description", description);
    console.log("conditions", conditions);

    try {
        const user = await User.findById(id);
        if (!user) {
            console.log("User not found");
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        const full_name = user.FirstName + " " + user.LastName;

        const trade = new Trade({
            title,
            description,
            conditions,
            postedBy: full_name,
            posterId: id,
        });

        const newTrade = await trade.save();
        console.log("New Trade created");

        //i also need to store this in the user's trade array

        // console.log("user", user)
        // console.log("user created trades", user.createdTrades)
        user.createdTrades.push(newTrade._id);
        user.save();
        console.log("Trade added to user's trade array");

        return res.json({
            success: true,
            message: "Trade created successfully",
        });
    } catch (error) {
        console.log("Error creating trade", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.get("/get-user-trades/:userid", async (req, res) => {
    const userId = req.params.userid;
    console.log("userId", userId);

    try {
        const user = await User.findById(userId);
        // console.log("user", user);
        if (!user) {
            console.log("User not found");
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        console.log("User's trades fetched successfully");
        let trades = [];
        //fetch the trades from the trades table
        for (let i = 0; i < user.createdTrades.length; i++) {
            const trade = await Trade.findById(user.createdTrades[i]);
            console.log("Trade", trade);
            trades.push(trade);
        }

        return res.json({
            success: true,
            message: "User's trades fetched successfully",
            userTrades: trades,
        });
    } catch (error) {
        console.log("Error fetching user's trades", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.get("/get-open-trades", async (req, res) => {
    try {
        const trades = await Trade.find({acceptedOffer: null});
        console.log("Open Trades fetched successfully");

        return res.json({
            success: true,
            message: "Trades fetched successfully",
            trades: trades,
        });
    } catch (error) {
        console.log("Error fetching trades", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.get("/get-trade-object/:trade_id", async (req, res) => {
    const tradeId = req.params.trade_id;

    try {
        const trade = await Trade.findById(tradeId);
        console.log("Trade fetched", trade);

        if (trade) {
            console.log("Trade fetched successfully");
            return res.json({
                success: true,
                message: "Trade fetched successfully",
                trade: trade,
            });
        } else {
            console.log("Trade not found");
            return res.status(400).json({
                success: false,
                message: "Trade not found",
            });
        }
    } catch (error) {
        console.log("Error fetching trade", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.get("/get-user-object/:user_id", async (req, res) => {
    const userId = req.params.user_id;

    try {
        const user = await User.findById(userId);
        console.log("User fetched", user);

        if (user) {
            console.log("User fetched successfully");
            return res.json({
                success: true,
                message: "User fetched successfully",
                user: user,
            });
        } else {
            console.log("User not found");
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
    } catch (error) {
        console.log("Error fetching user", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
})

export { router };
