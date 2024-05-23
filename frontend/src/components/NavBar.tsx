import React from "react";
import "../pages/css/navbar.css";
import { useState } from "react";
import { useContext } from "react";
import { usercontext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
    const { user, setUser } = useContext(usercontext);
    const navigate = useNavigate();

    const handleHomeClick = () => {
        // Handle home click logic
        console.log("Home clicked");
        navigate("/");
    };

    const handleBrowseClick = () => {
        // Handle browse click logic
        console.log("Browse clicked");
        navigate("/browse");
    };

    const handleProfileClick = () => {
        // Handle profile click logic
        console.log("Profile clicked");
        console.log("User while navigating to profile:", user);
        navigate("/profile");
    };

    const handleLogoutClick = async () => {
        // Handle logout click logic
        console.log("Logout clicked");
        const response = await axios.post("http://localhost:8000/auth/logout", {
            withCredentials: true,
        });
        console.log(response.data)
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <div className="nav-container">
            <nav>
                <div className="left-menu"> 
                    <ul>
                        <li>
                            <a href="#" onClick={handleHomeClick}>
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={handleBrowseClick}>
                                Browse
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={handleProfileClick}>
                                Profile
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="right-menu">
                    <ul>
                        <li>
                            <a href="#" onClick={handleLogoutClick}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;
