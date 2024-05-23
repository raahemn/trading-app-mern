import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    conditions: [{ type: String }],
    offers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true}],
    acceptedOffer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', default: null },

    //name of person who posted it
    postedBy: { type: String, required: true },
    posterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;
 