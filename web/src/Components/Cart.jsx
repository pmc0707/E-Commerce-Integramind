import React, { useState, useEffect } from "react";
import "./Card.css"; // Assuming your CSS file is named Cart.css
import { NavLink } from "react-router-dom";
import DiscountBadge from '../pages/Coupons/DiscountBadge';

const Cart = () => {
    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartProducts = async () => {
            const token = localStorage.getItem("access_token");
            if (token) {
                try {
                    const response = await fetch("http://localhost:5000/api/cart", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch cart products");
                    }

                    const products = await response.json();
                    setCartProducts(products);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setError("User not authenticated");
                setLoading(false);
            }
        };

        fetchCartProducts();
    }, []);

    if (loading) {
        return <div>Loading cart...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            {cartProducts.length > 0 ? (
                <div className="cart-products">
                    {cartProducts.map((product) => (
                        <NavLink to={`/product/${product.id}`} className="links-product" key={product.id}>
                            <div className="cart-item">
                                <img src={product.image} alt={product.title} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h2>{product.title}</h2>
                                    <p>Price: ₹{product.price}</p>
                                </div>
                                {/* Conditionally render discount if price is greater than or equal to ₹1000 */}
                                {product.price >= 600 && product.price < 1000 &&(
                                    <DiscountBadge discount={'5%'}/>
                                )}
                                 {product.price >= 1000 &&(
                                    <DiscountBadge discount={'10%'}/>
                                )}
                            </div>
                        </NavLink>
                    ))}
                </div>
            ) : (
                <div>Your cart is empty.</div>
            )}
        </div>
    );
};

export default Cart;
