import "./css/signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


//TODO: MAKE SURE DUPLICATE USERNAMES DONT SIGN UP


const Signup = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const firstname = formData.get("firstname");
        const lastname = formData.get("lastname");
        const username = formData.get("username");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmpassword");

        console.log("Username:", username);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);

        if (password === confirmPassword) {
            try {
                const response = await axios.post(
                    "http://localhost:8000/auth/signup",
                    {
                        FirstName: firstname,
                        LastName: lastname,
                        username,
                        password,
                    }
                );
                if (response.data.success) {
                    console.log("Signup successful:", response.data);
                    navigate("/login");
                }
                else
                {
                  console.log(response.data.message)
                  alert(response.data.message)
                }
            } catch (error) {
                console.error("Signup failed:", error);
                alert("Signup failed");
            }
        } else {
            console.error("Passwords do not match");
            alert("Passwords do not match");
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">Signup</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstname">First Name:</label>
                    <input type="text" id="firstname" name="firstname" placeholder="Enter First Name" />
                </div>
                <div>
                    <label htmlFor="lastname">Last Name:</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        placeholder="Enter Last Name"
                    />
                </div>

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
                <div>
                    <label htmlFor="confirmpassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmpassword"
                        name="confirmpassword"
                        placeholder="Re-enter Password"
                    />
                </div>
                <button type="submit">Signup</button>
            </form>
            <br></br>
            <p>
              {"Already have an account? "}
              <Link to={"/login"}>Login!</Link>
            </p>
        </div>
    );
};

export default Signup;
