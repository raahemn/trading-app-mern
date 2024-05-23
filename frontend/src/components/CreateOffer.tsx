import React, { useEffect, useState } from "react";
import "../pages/css/submitoffer.css";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { usercontext } from "../context/UserContext";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateOffer = ({ socket }: { socket: any }) => {
    const { trade_id } = useParams();
    const { user, setUser } = useContext(usercontext);
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit("join_room", trade_id);

        socket.on("trade_closed", (data: any) => {
            console.log("Trade closed:", data);
            alert("Trade has been closed.");
            // navigate("/browse");
            
        });

        return () => {
            socket.off("trade_closed");
            socket.emit("leave_room", trade_id);
        };
    }, [socket]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        console.log("Trade id:", trade_id);

        const num_items = formData.get("quantity");
        const cash = formData.get("cash");

        const offer_data = {
            name: user.FirstName,
            username: user.username,
            user: user.id,
            tradeOfferedFor: trade_id,
            numItemsOffered: num_items,
            cashOffered: cash,
        };
        console.log("Offer submitted:", offer_data);

        try {
            const response = await axios.post(
                "http://localhost:8000/offers/create-offer",
                offer_data,
                { withCredentials: true }
            );

            if (response.data.success) {
                console.log("Offer stored in db successfully:", response.data);
                socket.emit("send_offer", response.data.offer);
                alert("Offer submitted successfully!");

                // socket.emit("leave_room", trade_id);
            } else {
                console.log(
                    "Offer submission declined:",
                    response.data.message
                );
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Offer submission failed:", error);
            alert("Offer submission failed");
        }
    };

    return (
        <>
            <NavBar />
            <div className="create-offer-container">
                <form onSubmit={handleSubmit} id="create-offer-form">
                    <h1>Submit Your Offer</h1>
                    <label htmlFor="quantity">Number of Items:</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="0"
                        required
                    />

                    <label htmlFor="cash">Cash Offer ($):</label>
                    <input
                        type="number"
                        id="cash"
                        name="cash"
                        min="0"
                        step="any"
                        required
                    />

                    <button type="submit" className="submit-btn">
                        Submit Offer
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateOffer;
