import React from "react";
import NavBar from "../components/NavBar";
import "./css/home.css";

const Home = () => {
    return (
        <>
            <NavBar />
            <div className="hero">
                <div className="hero-overlay">
                    <h1>Welcome to TradeBiz!</h1>
                    <p>Your Trading Partner for Life.</p>
                </div>
            </div>
        </>
    );
};

export default Home;
