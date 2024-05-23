import React, { useEffect } from "react";
import "../pages/css/profile.css";
import { useState } from "react";
import { useContext } from "react";
import { usercontext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserInfo = () => {
    const { user, setUser } = useContext(usercontext);
    const [user_data, setUser_data] = useState(user);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (user.id) {
                    // Check if id is valid
                    console.log("id", user.id)
                    const response = await axios.get(
                        `http://localhost:8000/trades/get-user-object/${user.id}`,
                        { withCredentials: true }
                    );
                    if (response.data.success) {
                        console.log(
                            "User fetched successfully",
                            response.data.user
                        );
                        // setUser(response.data.user);
                        setUser_data(response.data.user);
                    }
                }
            } catch (error) {
                console.error(
                    "Error fetching user, info may be outdated:",
                    error
                );
            }
        };
        fetchUser();
    }, []);

    const handleUpdatePassword = () => {
        // Handle update password logic
        console.log("Update password clicked");
        navigate("/update-password");
    };

    const handleCreateOffer = () => {
        // Handle create offer logic
        console.log("Create offer clicked");
        navigate("/create-trade");
    };

    return (
        <div className="profile-content">
            <div className="top-section">
                <div className="user-info">
                    <div>
                        <h1>
                            {user.FirstName} {user.LastName}
                        </h1>
                        <p className="user-username">
                            Username: {user.username}
                        </p>
                        <button
                            className="update-password-btn"
                            onClick={handleUpdatePassword}
                        >
                            Update Password
                        </button>
                        <button
                            className="create-offer-btn"
                            onClick={handleCreateOffer}
                        >
                            Create Trade Offer
                        </button>
                    </div>
                </div>
                <div className="cash-counter">
                    <p>Cash: {user_data.cash}</p>
                </div>
                <br></br>
                <div className="cash-counter">
                    <p>Items Owned: {user_data.numItemsOwned}</p>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
