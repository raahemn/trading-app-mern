import React, { useEffect } from "react";
import "../pages/css/mytrade.css";
import { useContext } from "react";
import { tradecontext } from "../context/TradeContext";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usercontext } from "../context/UserContext";

interface Trade {
    title: string;
    description: string;
    conditions: string[];
}

const OwnTrade = ({ trade_id, socket }: { trade_id: any; socket: any }) => {
    const [trade, setTrade] = useState({} as Trade);

    const navigate = useNavigate();

    const [offers, setOffers] = useState<any>([]);
    let prev_offers_loaded = false;

    useEffect(() => {
        async function getTradeDetails() {
            const response = await axios.get(
                `http://localhost:8000/trades/get-trade-object/${trade_id}`,
                { withCredentials: true }
            );

            console.log("Response from api", response.data);

            if (response.data.success) {
                console.log("Trade fetched", response.data.trade);
                setTrade(response.data.trade);
            }
        }

        async function getStoredOffers() {
            if (prev_offers_loaded) return;
            prev_offers_loaded = true;
            const response = await axios.get(
                `http://localhost:8000/offers/get-trade-offers/${trade_id}`,
                { withCredentials: true }
            );

            console.log(
                "Response from get trade offers API:",
                response.data.offers
            );

            if (response.data.success) {
                setOffers(response.data.offers);
                // if (offers.length === 0) {
                //     setOffers(response.data.offers);
                // } else {
                //     setOffers([...offers, response.data.offers]);
                // }
            }
        }
        console.log("use effect triggered", prev_offers_loaded);
        getTradeDetails();
        getStoredOffers();
    }, []);

    useEffect(() => {
        socket.emit("join_room", trade_id); 

        socket.on("receive_offer", (data: any) => {
            console.log(
                "Received offer from socket inside useEffect in OwnTrade",
                data
            );

            setOffers((prevOffers: any) => [...prevOffers, data]);
        });

        //cleanup function to disconnect
        return () => {
            socket.off("receive_offer");
        };
    }, [socket]);

    const handleAccept = async (offer: any, index: any) => {
        console.log("Offer accepted", offer);
        // socket.emit("accept_offer", offer);

        try {
            const response = await axios.post(
                `http://localhost:8000/offers/accept-offer/`,
                {
                    offerId: offer._id,
                    tradeId: trade_id,
                },
                { withCredentials: true }
            );
            console.log("Response from accepting offer", response.data);

            if (response.data.success) {
                // alert("Offer accepted successfully");
                console.log("Offer accepted successfully");
                setOffers([]);

                socket.emit("accept_offer", trade_id);

                alert("Trade closed successfully.");
                // navigate("/browse");
                
            } else {
                console.log("Error accepting offer", response.data.message);
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error accepting offer", error);
        }
    };

    const handleReject = async (offer: any, index: any) => {
        console.log("Offer rejected", offer);
        // socket.emit("reject_offer", offer);

        try {
            const response = await axios.post(
                `http://localhost:8000/offers/reject-offer/`,
                {
                    offerId: offer._id,
                    tradeId: trade_id,
                },
                { withCredentials: true }
            );

            console.log("Response from reject offer", response.data);

            if (response.data.success) {
                console.log("Offer rejected");

                const updatedOffers = offers.filter(
                    (offer: any, i: number) => i !== index
                );

                console.log("Updated offers", updatedOffers)
                setOffers(updatedOffers);
            } else {
                console.log("Error rejecting offer", response.data.message);
                alert("Could not rejecting offer");
            }
        } catch (error) {
            console.error("Error rejecting offer", error);
        }
    };

    return (
        <div className="trade-detail-container">
            <h1 className="trade-title">{trade.title}</h1>

            <p className="trade-details">{trade.description}</p>
            <h3>Accepting Conditions:</h3>
            {trade.conditions &&
                trade.conditions.map((condition: any, index: any) => (
                    <div key={index}>
                        <ul className="accepting-conditions">
                            <li>{condition}</li>
                        </ul>
                    </div>
                ))}

            <div className="offers-section">
                <h3>Offers: {offers.length}</h3>

                {offers.map((offer: any, index: any) => (
                    <div className="offer" key={index}>
                        <div className="offer-top">
                            <div>
                                <h4 className="user-name">{offer.name} </h4>
                                <p className="user-username">
                                    @{offer.username}
                                </p>
                            </div>
                        </div>
                        <div className="offer-details">
                            <p className="commodity-quantity">
                                Number of Items Offered: {offer.numItemsOffered}
                                <br></br>
                            </p>

                            <p className="offer-cash">
                                <br></br>
                                Cash Offer: {offer.cashOffered}
                            </p>
                        </div>
                        <div className="offer-actions">
                            <button
                                className="offer-accept-btn"
                                onClick={() => handleAccept(offer, index)}
                            >
                                Accept
                            </button>
                            <button
                                className="offer-reject-btn"
                                onClick={() => handleReject(offer, index)}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OwnTrade;
