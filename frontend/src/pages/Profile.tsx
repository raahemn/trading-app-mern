import React from "react";
// import "./css/profile.css";
import NavBar from "../components/NavBar";
import UserInfo from "../components/UserInfo";
import MyTrades from "../components/MyTrades";
import MyOffers from "../components/MyOffers";
import { useContext } from "react";
import { usercontext } from "../context/UserContext";

function Profile() {
    const { user } = useContext(usercontext);
    return (
        <div className="main">
        <NavBar />
        <div className="profile-content">
            
            <UserInfo />
            <MyTrades />
            <MyOffers />
        </div>
        </div>
    );
}

export default Profile;
