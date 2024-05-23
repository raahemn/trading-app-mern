import mongoose from "mongoose";

const Schema = mongoose.Schema;

const offerSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    numItemsOffered: {type: Number, default: 0}, 
    cashOffered: { type: Number, default: 0 },
    tradeOfferedFor: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade', required: true },
    status: { type: String, default: "Pending" },
});

const Offer = mongoose.model('Offer', offerSchema); 

export default Offer;
 