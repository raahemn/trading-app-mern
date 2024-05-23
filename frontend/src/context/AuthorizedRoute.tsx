import React, { useContext, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { usercontext } from "./UserContext";

function AuthorizedRoute() {
    const { user, setUser } = useContext(usercontext);
    const [userDataLoaded, setUserDataLoaded] = useState(false);

    useEffect(() => {
        console.log("Checking local storage in authorized path");
        const userStored = localStorage.getItem("user");

        if (userStored) {
            console.log("User found in local storage", userStored);
            setUser(JSON.parse(userStored));
            console.log("User set to", JSON.parse(userStored));
        }

        setUserDataLoaded(true);
    }, []);

    if (!userDataLoaded) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Outlet />;
    } else {
        return <Navigate to={"/login"} />;
    }
}

export default AuthorizedRoute;
