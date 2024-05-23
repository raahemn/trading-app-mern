import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {router as authRouter} from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import {router as tradeRouter} from "./routes/tradeRoute.js";
import checkAuth from "./utils/checkAuth.js";
import { router as offerRouter } from "./routes/offerRoute.js";

export const app = express();
dotenv.config();

// app.use(cors());
app.use(cors({ origin: true, credentials: true }));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/trades", checkAuth, tradeRouter);
app.use("/offers", checkAuth, offerRouter);


console.log("connection string", process.env.MONG_URI);

mongoose
    .connect(process.env.MONG_URI)

    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => {
        console.log("Error connecting to Database", err);
    });
