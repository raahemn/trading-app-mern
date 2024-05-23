import { useContext } from "react";
import { usercontext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages/css/updatepassword.css";
import NavBar from "../components/NavBar";

const UpdatePassword = () => {
    const { user } = useContext(usercontext);
    const navigate = useNavigate();

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const oldPassword = formData.get("old_password");
        const newPassword = formData.get("new_password");

        console.log("Old Password:", oldPassword);
        console.log("New Password:", newPassword);

        if (oldPassword === newPassword) {
            alert("New and Old passwords must be different");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/auth/update-password",
                {
                    id: user.id,
                    password: oldPassword,
                    newPassword: newPassword,
                }
            );
            if (response.data.success) {
                console.log("Change Password successful:", response.data);
                navigate("/");
            } else {
                console.log(response.data.message);
                alert("Change Password failed");
            }
        } catch (error) {
            console.error("Change Password failed:", error);
            alert("Change Password failed");
        }
    };

    return (
        <>
            <NavBar />
            <div className="update-password-container">
                <h2 className="update-password-title">Update Password</h2>
                <form className="update-password-form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="old_password">Old Password:</label>
                        <input
                            type="password"
                            id="old_password"
                            name="old_password"
                            placeholder="Enter Old Password"
                        />
                    </div>
                    <div>
                        <label htmlFor="new_password">New Password:</label>
                        <input
                            type="password"
                            id="new_password"
                            name="new_password"
                            placeholder="Enter New Password"
                        />
                    </div>
                    <button type="submit">Update Password</button>
                </form>
            </div>
        </>
    );
};

export default UpdatePassword;
