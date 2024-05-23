import React, { useEffect } from "react";
import "../pages/css/trade.css";
import { useContext } from "react";
import { tradecontext } from "../context/TradeContext";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
 

interface Trade {
    title: string;
    description: string;
    conditions: string[];
}

const OthersTrade = ({ trade_id, socket }: { trade_id: any; socket: any }) => {
    const [trade, setTrade] = useState({} as Trade);
    const navigate = useNavigate();

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
        getTradeDetails();
    }, []);

    const clickOfferTrade = () => {
        console.log("Offer trade clicked");
        navigate(`/create-offer/${trade_id}`);
    };

    return (
        <div className="others-trade-detail-container">
            <h1 className="others-trade-title">{trade.title}</h1>

            <p className="others-trade-details">{trade.description}</p>
            <h3>Accepting Conditions:</h3>
            {trade.conditions &&
                trade.conditions.map((condition: any, index: any) => (
                    <div key={index}>
                        <ul className="others-accepting-conditions">
                            <li>{condition}</li>
                        </ul>
                    </div>
                ))}

            <button className="offer-trade-btn" onClick={clickOfferTrade}>
                Offer Trade
            </button>
        </div>
    );
};

export default OthersTrade;
