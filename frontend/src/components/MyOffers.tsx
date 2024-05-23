import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usercontext } from "../context/UserContext";

const MyOffers = () => {
    const [offers, setOffers] = useState([]);
    const { user } = useContext(usercontext);
    const navigate = useNavigate();
    const lsuser :any= localStorage.getItem("user")
    const id = JSON.parse(lsuser) ? JSON.parse(lsuser).id : null;

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/offers/get-user-offers/${id}`,
                    { withCredentials: true }
                ); 

                if (response.data.success) {
                    console.log(
                        "Offers fetched successfully",
                        response.data.offers
                    );
                    if (response.data.offers) {
                        setOffers(response.data.offers);
                    }
                }
            } catch (error) {
                console.error("Error fetching offers:", error);
            }
        };

        fetchOffers();
    }, []);

    return (
        <div className="offers-sent-container">
            <h2>Offers Sent: {offers.length}</h2>
            <div>
                {offers.length === 0 ? (
                    <h5>There are no offers to display at this moment.</h5>
                ) : (
                    offers.map((offer: any, index: any) => (
                        <div className="offer-tile" key={index}>
                            <div className="offer-info">
                                <h3 className="offer-title">
                                    Trade Id: {offer.tradeOfferedFor}
                                </h3>
                                <p className="offer-description">
                                    Number of Items Offered: {offer.numItemsOffered}
                                    Cash Offered: {offer.cashOffered}
                                </p>
                            </div>
                            <div className="offer-status">{offer.status}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOffers;
