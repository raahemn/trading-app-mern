import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import "bootstrap/dist/css/bootstrap.min.css";
import ContextProvider from "./context/UserContext";
import AuthorizedRoute from "./context/AuthorizedRoute";
import { useEffect } from "react";
import { usercontext } from "./context/UserContext";
import { useContext } from "react";
import Profile from "./pages/Profile";
import UpdatePassword from "./pages/UpdatePassword";
import CreateTrade from "./pages/CreateTrade";
import Browse from "./pages/Browse";
import SpecificTrade from "./pages/SpecificTrade";
import TradeProvider from "./context/TradeContext";
import CreateOffer from "./components/CreateOffer";
import io from "socket.io-client";

const socket = io("http://localhost:8000");


function App() {

    return (
        <ContextProvider>
            <TradeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<AuthorizedRoute />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route
                                path="/update-password"
                                element={<UpdatePassword />}
                            />
                            <Route
                                path="/create-trade"
                                element={<CreateTrade />}
                            />

                            <Route path="/browse" element={<Browse />} />

                            <Route
                                path="/specific-trade/:tradeId/:tradePosterId"
                                element={<SpecificTrade socket={socket}/>}
                            />
                            <Route path="/create-offer/:trade_id" element = {<CreateOffer socket={socket}/>} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </BrowserRouter>
            </TradeProvider>
        </ContextProvider>
    );
}

export default App;
