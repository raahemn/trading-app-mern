import React from "react";
import CreateOffer from "../components/CreateOffer";
import { useNavigate } from "react-router-dom";
import { tradecontext } from "../context/TradeContext";
import { usercontext } from "../context/UserContext";
import { useContext } from "react";
import OwnTrade from "../components/OwnTrade";
import NavBar from "../components/NavBar";
import OthersTrade from "../components/OthersTrade";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const SpecificTrade = ({ socket }: { socket: any }) => {
    const { user } = useContext(usercontext);
    const { tradeId, tradePosterId } = useParams();
    let joinedRoom = false;

    console.log("Trade id", tradeId);
    console.log("Trade poster id", tradePosterId);
    const lsuser :any= localStorage.getItem("user")
    const id = JSON.parse(lsuser) ? JSON.parse(lsuser).id : null;
    console.log("Local storage user id", id);

    if (id === tradePosterId) {
        return (
            <div>
                <NavBar />

                <OwnTrade trade_id={tradeId} socket={socket} />
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <OthersTrade trade_id={tradeId} socket={socket} />
        </div>
    );
};

export default SpecificTrade;
