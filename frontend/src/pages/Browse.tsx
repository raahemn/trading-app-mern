import React, { useEffect, useState } from "react";
import "./css/browse.css";
import NavBar from "../components/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { tradecontext } from "../context/TradeContext";
import { usercontext } from "../context/UserContext";
import { useContext } from "react";

const Browse = () => {
    const [trades, setTrades] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { setTradeId, setTradePosterId } = useContext(tradecontext);
    const { user } = useContext(usercontext);

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/trades/get-open-trades",
                    { withCredentials: true }
                );

                if (response.data.success && response.data.trades) {
                    console.log(
                        "Trades fetched successfully",
                        response.data.trades
                    );
                    setTrades(response.data.trades);
                }
                
            } catch (error) {
                console.error("Error fetching trades:", error);
            }
        };

        fetchTrades();
    }, []);

    const handleSearchInputChange = (e: any) => {
        setSearchQuery(e.target.value);
    };

    const filteredTrades = trades.filter((trade: any) =>
        trade.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleItemClick = (trade: any) => {
        console.log("item clicked");

        console.log("trade and user", trade.posterId, user.id);
        setTradeId(trade._id);
        setTradePosterId(trade.posterId);

        navigate(`/specific-trade/${trade._id}/${trade.posterId}`);
    };

    return (
        <>
            <NavBar />
            <div className="main-browse">
                <section className="search-section">
                    <input
                        type="text"
                        id="searchBar"
                        placeholder="Search trades..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                </section>

                <section className="trades-list">
                    {filteredTrades.length === 0 ? (
                        <h5>There are no trades to show at this moment.</h5>
                    ) : (
                        filteredTrades.map((trade: any, index: any) => (
                            <div
                                className="trade-item"
                                key={index}
                                onClick={() => handleItemClick(trade)}
                            >
                                <div className="trade-info">
                                    <h3 className="trade-title">
                                        {trade.title}
                                    </h3>
                                    <p className="trade-description">
                                        Description:
                                        <br></br>
                                        {trade.description}
                                    </p>
                                    <div className="trade-conditions">
                                        Conditions:
                                        {trade.conditions.map(
                                            (condition: any, index: any) => (
                                                <span
                                                    className="condition-badge"
                                                    key={index}
                                                >
                                                    {condition}
                                                </span>
                                            )
                                        )}
                                    </div>
                                    <p className="profile-name">
                                        Posted by: {trade.postedBy}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </div>
        </>
    );
};

export default Browse;
