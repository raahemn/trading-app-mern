import express from "express";
import Offer from "../models/offerModel.js";
import Trade from "../models/tradeModel.js";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/get-user-offers/:userid", async (req, res) => {
    const userId = req.params.userid;
    //console.log("User id to get sent offers for:", userId);
    try {
        const offers = await Offer.find({ user: userId });

        // //console.log("Offers fetched from db:", offers)
        return res.json({ success: true, offers });
    } catch (error) {
        //console.log("Error getting offers", error);
        return res
            .status(400)
            .json({ success: false, message: "Internal Server Error" });
    }
});

router.get("/get-trade-offers/:tradeid", async (req, res) => {
    const tradeId = req.params.tradeid;
    //console.log("Trade id to get pending offers for:", tradeId);

    try {
        const offers = await Offer.find({
            tradeOfferedFor: tradeId,
            status: "Pending",
        });

        //console.log("pending Offers fetched from db:");

        return res.json({ success: true, offers });
    } catch (error) {
        //console.log("Error getting offers", error);
        return res
            .status(400)
            .json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/create-offer", async (req, res) => {
    const offer = req.body;

    // //console.log("Offer to create for user:", offer,offer.user);

    try {
        const user = await User.findById(offer.user);

        if (offer.numItemsOffered > user.numItemsOwned) {
            return res.json({
                success: false,
                message: "You do not have enough items to offer",
            });
        }

        if (offer.cashOffered > user.cash) {
            return res.json({
                success: false,
                message: "You do not have enough cash to offer",
            });
        }

        //user must not have offered to this trade before
        const existing_offer = await Offer.findOne({
            tradeOfferedFor: offer.tradeOfferedFor,
            user: offer.user,
        });

        if (existing_offer) {
            return res.json({
                success: false,
                message: "You have already placed an offer for this trade",
            });
        }

        const newOffer = new Offer(offer);

        const stored_offer = await newOffer.save();

        // //console.log("offer saved:", stored_offer);

        const trade = await Trade.findById(offer.tradeOfferedFor);

        trade.offers.push(stored_offer._id);

        const saved_trade = await trade.save();

        if (stored_offer && saved_trade) {
            return res.json({
                success: true,
                message: "Offer created successfully",
                offer: stored_offer,
            });
        } else {
            return res.json({
                success: false,
                message: "Offer not created",
            });
        }
    } catch (error) {
        //console.log("Error creating offer", error);
        return res
            .status(400)
            .json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/accept-offer", async (req, res) => {
    const { tradeId, offerId } = req.body;

    //console.log("tradeId in accept offer", tradeId);
    //console.log("offerId", offerId);

    try {
        const trade = await Trade.findById(tradeId);
        const offer = await Offer.findById(offerId);

        if (!trade) {
            //console.log("Trade not found");
            return res.status(400).json({
                success: false,
                message: "Trade not found",
            });
        }

        if (!offer) {
            //console.log("Offer not found");
            return res.status(400).json({
                success: false,
                message: "Offer not found",
            });
        }

        trade.acceptedOffer = offerId;
        offer.status = "Accepted";

        //deduct given items and cash from user
        const user = await User.findById(offer.user);
        //first, i need to check that the user still has the items and cash needed for this trade
        if (offer.numItemsOffered > user.numItemsOwned) {
            return res.json({
                success: false,
                message:
                    "User no longer has enough items for this offer to be accepted.",
            });
        }

        if (offer.cashOffered > user.cash) {
            return res.json({
                success: false,
                message:
                    "User no longer has enough cash for this offer to be accepted.",
            });
        }

        user.numItemsOwned -= offer.numItemsOffered;
        user.cash -= offer.cashOffered;

        //update all other offers to rejected
        const offers = await Offer.find({ tradeOfferedFor: tradeId });
        offers.forEach(async (offer) => {
            if (offer._id.toString() !== offerId) {
                offer.status = "Rejected";
                await offer.save();
            }
        });

        //add items and cash to trade creator
        const tradeCreator = await User.findById(trade.posterId);
        //console.log("Trade creator", tradeCreator);

        tradeCreator.numItemsOwned += offer.numItemsOffered;
        tradeCreator.cash += offer.cashOffered;

        const saved_user = await user.save();
        const saved_trade = await trade.save();
        const saved_offer = await offer.save();
        const saved_tradeCreator = await tradeCreator.save();

        return res.json({
            success: true,
            message: "Offer accepted successfully",
        });
    } catch (error) {
        //console.log("Error accepting offer", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.post("/reject-offer", async (req, res) => {
    const { tradeId, offerId } = req.body;

    //console.log("tradeId in reject offer", tradeId);
    //console.log("offerId", offerId);

    try {
        const trade = await Trade.findById(tradeId);
        const offer = await Offer.findById(offerId);

        if (!trade) {
            //console.log("Trade not found");
            return res.status(400).json({
                success: false,
                message: "Trade not found",
            });
        }

        if (!offer) {
            //console.log("Offer not found");
            return res.status(400).json({
                success: false,
                message: "Offer not found",
            });
        }

        offer.status = "Rejected";

        const saved_offer = await offer.save();

        if (saved_offer) {
            return res.json({
                success: true,
                message: "Offer rejected successfully",
            });
        } else {
            return res.json({
                success: false,
                message: "Offer rejection failed",
            });
        }
    } catch (error) {
        //console.log("Error rejecting offer", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

export { router };
