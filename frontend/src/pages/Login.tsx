import React from "react";
import "./css/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usercontext } from "../context/UserContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const { setUser } = useContext(usercontext);
    const navigate = useNavigate();

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get("username");
        const password = formData.get("password");

        console.log("Username:", username);
        console.log("Password:", password);

        try {
            const response = await axios.post(
                "http://localhost:8000/auth/login",
                {
                    username,
                    password,
                },
                { withCredentials: true}
            );
            if (response.data.success) {
                console.log("Login successful:", response.data);
                setUser(response.data.user);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                navigate("/");
            } else {
                console.log("Login failed",response.data.message);
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter Username"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter Password"
                    />
                </div>
                <button type="submit">Login</button>

            </form>
            <br></br>
            <p>
              {"Don't have an account yet? "}
              <Link to={"/signup"}>Signup!</Link>
            </p>
            
        </div>
    );
};

export default Login;
