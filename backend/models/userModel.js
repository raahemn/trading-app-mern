import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    numItemsOwned: { type: Number, default: 10 },
    createdTrades: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trade" }],
    cash :  {type: Number, default: 1000},
});

const User = mongoose.model("User", userSchema);

export default User;
