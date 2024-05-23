import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { usercontext } from "../context/UserContext";
import axios from "axios";

const MyTrades = () => {
    const [trades, setTrades] = useState<any[]>([]);
    const { user } = useContext(usercontext);
    const lsuser: any = localStorage.getItem("user");
    const id = JSON.parse(lsuser) ? JSON.parse(lsuser).id : null;

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/trades/get-user-trades/${id}`,
                    { withCredentials: true }
                );

                if (response.data.success) {
                    if (response.data.userTrades) {
                        console.log(
                            "Trades fetched successfully",
                            response.data.userTrades
                        );
                        setTrades(response.data.userTrades);
                    }
                }
            } catch (error) {
                console.error("Error fetching trades:", error);
            }
        };

        fetchTrades();
    }, []);

    return (
        <div>
            <h2>My Trades</h2>
            {trades.length === 0 ? (
                <h5>There are no trades to display at this moment.</h5>
            ) : (
                trades.map((trade, index) => (
                    <div className="trade-item" key={index}>
                        <div className="trade-info">
                            <h3 className="trade-title">{trade.title}</h3>
                            <p className="trade-description">
                                {trade.description}
                            </p>
                            <div className="trade-conditions">
                                Conditions:
                                {trade.conditions.map(
                                    (condition: any, index: any) => (
                                        <span
                                            key={index}
                                            className="condition-badge"
                                        >
                                            {condition}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="trade-action">
                            {trade.acceptedOffer? (
                                <div className="see-trade-status-btn">
                                    Closed
                                </div>
                            ) : (
                                <div className="see-trade-status-btn">Open</div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyTrades;
