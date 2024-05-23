import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.js";
import { config } from "dotenv";
import Offer from "./models/offerModel.js";

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

config({
    path: "./config.env",
});

let rooms = {}; //here ill just store the trade creator and trade id both so i know who to send the offer to
let userMap = {}; //here ill store the user id and socket id so i can send the offer to the correct user

let offers = [];
let times = 0;

let room_sockets = [];

io.on("connection", (socket) => {
    console.log("USER CONNECTED:", socket.id);

    socket.on("join_room", (tradeId) => {
        console.log("WANTS TO JOIN", socket.id);
        socket.join(tradeId);

        console.log("USER JOINED ROOM for trade:", tradeId);
    });

    socket.on("leave_room", (tradeId) => {
        console.log("WANTS TO LEAVE", socket.id);
        socket.leave(tradeId);

        console.log("USER LEFT ROOM for trade:", tradeId);
    });

    socket.on("send_offer", (data) => {
        console.log("SEND OFFER DATA", data);
        console.log("room sockets", room_sockets);

        console.log("times", times);
        console.log("Trade id", data.tradeOfferedFor);

        //send the offer to the users in the room
        io.to(data.tradeOfferedFor).emit("receive_offer", data);
    });

    socket.on("accept_offer", (data) => {
        console.log("ACCEPT OFFER Trade ID", data);
        
        io.to(data).emit("trade_closed", data);
        console.log("SERVER EMITTED")
    });

    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED:", socket.id);
    });
});

server.listen(8000, () => {
    console.log("Server is running on port 8000");
});
