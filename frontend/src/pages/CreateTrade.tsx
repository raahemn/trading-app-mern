import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages/css/createtrade.css";
import { useContext } from "react";
import { usercontext } from "../context/UserContext";
import NavBar from "../components/NavBar";

const CreateTrade = () => {
    const navigate = useNavigate();
    const lsuser :any= localStorage.getItem("user")
    const id = JSON.parse(lsuser) ? JSON.parse(lsuser).id : null;
    console.log("Local storage user id", id);

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        console.log("User id in handle create trade:", id)

        const formData = new FormData(event.target);
        const title = formData.get("title");
        const description = formData.get("description");

        let conditions: string = formData.get("conditions") as string;

        let arr: string[] = [];

        if (conditions) {
            arr = conditions.split(",");
            arr = arr.map((condition) => condition.trim());
        }
        console.log("Conditions:", arr);

        try {
            console.log("User id when creating trade:", id)
            const response = await axios.post(
                "http://localhost:8000/trades/create-new-trade/",
                {
                    id: id,
                    title,
                    description,
                    conditions: arr,
                },
                { withCredentials: true}
            );
            if (response.data.success) {
                console.log("Trade created successfully:", response.data);
                navigate("/profile");
            } else {
                console.log(response.data.message);
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Trade creation failed:", error);
            alert("Trade creation failed");
        }
    };

    return (
        <>
            <NavBar />
            <div className="create-trade-container">
                <h2 className="create-trade-title">Create Trade</h2>
                <form className="create-trade-form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter Title"
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Enter Description"
                        />
                    </div>
                    <div>
                        <label htmlFor="conditions">
                            Conditions (comma-separated):
                        </label>
                        <input
                            type="text"
                            id="conditions"
                            name="conditions"
                            placeholder="Enter Conditions"
                        />
                    </div>
                    <button type="submit">Create Trade</button>
                </form>
            </div>
        </>
    );
};

export default CreateTrade;
