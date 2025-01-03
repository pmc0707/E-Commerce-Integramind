import React, { useState, useEffect } from 'react';
 // Importing star icons
import { Link } from 'react-router-dom'; // Importing Link for routing
import Skeleton from "react-loading-skeleton";
import "./OrderHistory.css";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState({});
    const [ratings, setRatings] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:5000/orders"); 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log("Fetched Orders:", result.orders); // Log fetched orders
                setOrders(result.orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleRatingChange = (orderId, value) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [orderId]: value
        }));
    };

    const handleReviewChange = (orderId, value) => {
        setReviews((prevReviews) => ({
            ...prevReviews,
            [orderId]: value
        }));
    };

    const handleSubmit = async (orderId) => {
        const rating = ratings[orderId] || 0; // Default to 0 if undefined
        const review = reviews[orderId] || ''; // Default to empty string if undefined
        console.log(`Submitting for order ${orderId}: Rating = ${rating}, Review = "${review}"`);

        try {
            const response = await fetch(`http://localhost:5000/orders/${orderId}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating, review })
            });
            if (!response.ok) {
                throw new Error('Failed to submit review');
            }
            // Optionally reset the fields after successful submission
            setRatings((prev) => ({ ...prev, [orderId]: 0 })); // Reset rating
            setReviews((prev) => ({ ...prev, [orderId]: '' })); // Reset review
            console.log("Review submitted successfully");
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    if (loading) {
        return (
            <div className="order-history__container">
                <Skeleton height={50} count={5} />
            </div>
        );
    }

    return (
        <div className="order-history__container">
            <h1 className="order-history__title">Order History</h1>
            <div className="order-history__row">
                {orders.map((order) => (
                    <div className="order-history__card-col" key={order._id}>
                        <Link to={`/review_rating/${order.product.id}`} className="order-history__card-link">
                            <div className="order-history__card">
                                <img 
                                    src={order.product.image} 
                                    className="order-history__card-img-top" 
                                    alt={order.product.title} 
                                />
                                <div className="order-history__card-body">
                                    <div className="order_history_data">
                                        <div>
                                            <h5 className="order-history__card-title">{order.product.title}</h5>
                                            <p className="order-history__card-price">₹{order.product.price}</p>
                                        </div>
                                        <div>
                                            <p className="order-history__card-date">Ordered on: {order.date_of_buy}</p>
                                            <p className="order-history__card-delivery-date">Delivery Date: {order.delivery_date}</p>
                                        </div>
                                    </div>

                                    
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
