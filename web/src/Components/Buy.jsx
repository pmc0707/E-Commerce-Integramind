import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Buy.css';
import axios from 'axios';  // Import axios for handling coupon validation

const Buy = () => {
    const { id } = useParams(); // Get product ID from URL
    const [product, setProduct] = useState(null); // State to hold product data
    const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' });
    const [showPayment, setShowPayment] = useState(false);
    const [showDelivery, setShowDelivery] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [owner, setOwner] = useState("");
    const [couponCode, setCouponCode] = useState('');  // State for coupon code input
    const [discount, setDiscount] = useState(0);  // State for discount
    const [couponError, setCouponError] = useState('');  // Error handling for coupon
    const [finalPrice, setFinalPrice] = useState(0);  // State for final price after discount
    const [totalCartValue, setTotalCartValue] = useState(0);  // Total cart value (discounted price without coupon)
    const navigate = useNavigate(); // For redirecting after order confirmation

    // Fetch product details based on ID
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/products/${id}`);
                if (!response.ok) {
                    throw new Error("Product not found");
                }
                const productData = await response.json();
                setProduct(productData); // Set product data
                setTotalCartValue(productData.discountedPrice);  // Set initial total cart value (discounted price without coupon)
                setFinalPrice(productData.discountedPrice);  // Set initial final price to discounted price
                setOwner(productData.ownerName);
            } catch (error) {
                console.error("Error fetching product:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setShowPayment(true);
    };

    const handleCouponChange = (e) => {
        setCouponCode(e.target.value);
    };

    const handleApplyCoupon = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/coupons');
            const coupon = response.data.find(c => c.coupon_code === couponCode && c.status === 'active');

            if (coupon) {
                if (totalCartValue >= coupon.cart_minimum) {
                    const discountAmount = coupon.coupon_type === 'percentage' 
                        ? (coupon.coupon_value / 100) * totalCartValue 
                        : coupon.coupon_value;

                    setDiscount(discountAmount);
                    setFinalPrice(totalCartValue - discountAmount);  // Update final price after applying discount
                    setCouponError('');
                } else {
                    setCouponError(`Cart value must be at least ₹${coupon.cart_minimum} to apply this coupon.`);
                    setDiscount(0); // Reset discount if conditions aren't met
                    setFinalPrice(totalCartValue); // Reset final price to total cart value
                }
            } else {
                setCouponError('Invalid or inactive coupon.');
                setDiscount(0); // Reset discount if coupon is invalid
                setFinalPrice(totalCartValue); // Reset final price to total cart value
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            setCouponError('Error applying coupon. Please try again.');
        }
    };

    const handlePaymentSubmit = async () => {
        try {
            const orderDetails = {
                product: {
                    title: product.title,
                    price: product.price,
                    discountedPrice: finalPrice,  // Pass the final price after discount
                    image: product.image,
                    id: product.id
                },
                address,
                owner: owner,
            };

            const response = await fetch('http://localhost:5000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // "Order added"
                setShowDelivery(true); // Show delivery information after order is confirmed
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
            }
        } catch (error) {
            console.error('Error submitting payment:', error);
        }
    };

    if (loading) return <div>Loading product...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="buy-interface__container">
            <h2 className="buy-interface__title">Checkout</h2>

            <div className="buy-interface__row">
                <div className="buy-interface__left-column">
                    {!showPayment ? (
                        <>
                            <h3 className="buy-interface__section-title">Address</h3>
                            <form className="buy-interface__form" onSubmit={handleAddressSubmit}>
                                <div className="buy-interface__input-group">
                                    <label>
                                        Street:
                                        <input type="text" name="street" value={address.street} onChange={handleAddressChange} required className="buy-interface__input" />
                                    </label>
                                </div>
                                <div className="buy-interface__input-group">
                                    <label>
                                        City:
                                        <input type="text" name="city" value={address.city} onChange={handleAddressChange} required className="buy-interface__input" />
                                    </label>
                                </div>
                                <div className="buy-interface__input-group">
                                    <label>
                                        State:
                                        <input type="text" name="state" value={address.state} onChange={handleAddressChange} required className="buy-interface__input" />
                                    </label>
                                </div>
                                <div className="buy-interface__input-group">
                                    <label>
                                        Zip Code:
                                        <input type="text" name="zip" value={address.zip} onChange={handleAddressChange} required className="buy-interface__input" />
                                    </label>
                                </div>
                                <button type="submit" className="buy-interface__submit-button">Continue to Payment</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h3 className="buy-interface__section-title">Payment</h3>

                            <div className="buy-interface__coupon-section">
                                <label>
                                    Apply Coupon:
                                    <input type="text" value={couponCode} onChange={handleCouponChange} className="buy-interface__input" />
                                </label>
                                <button onClick={handleApplyCoupon} className="buy-interface__submit-button">Apply Coupon</button>
                                {couponError && <p className="buy-interface__error">{couponError}</p>}
                                {discount > 0 && (
                                    <p className="buy-interface__success">
                                        Coupon Applied: ₹{discount} off
                                    </p>
                                )}
                            </div>

                            <div className="buy-interface__price-details">
                                <h4>Total Cart Value: ₹{totalCartValue}</h4>
                                {discount > 0 && (
                                    <>
                                        <h4>Coupon Discount: -₹{discount}</h4>
                                        {couponCode && <h5>({couponCode} applied)</h5>}
                                    </>
                                )}
                                <h4>Final Price: ₹{finalPrice}</h4>
                            </div>

                            <div className="scanner-container">
                                <div className="img34"></div>
                                <p>Scan and pay with any UPI app</p>
                                <p>Merchant: <strong>{owner}</strong></p>
                            </div>
                            <button type="button" className="buy-interface__submit-button" onClick={handlePaymentSubmit}>Confirm Payment of ₹{finalPrice}</button>
                        </>
                    )}

                    {showDelivery && product && (
                        <div className="buy-interface__delivery-section">
                            <h3 className="buy-interface__section-title">Delivery Information</h3>
                            <p>Your order for <strong>{product.title}</strong> will be delivered to:</p>
                            <p>{`${address.street}, ${address.city}, ${address.state}, ${address.zip}`}</p>
                        </div>
                    )}
                </div>

                <div className="buy-interface__right-column">
                    <h3 className="buy-interface__section-title">Order Summary</h3>
                    {product && (
                        <div className="card text-center">
                            <img src={product.image} className="card-img-top2" alt={product.title} height="430px" />
                            <div className="card-body">
                                <h5 className="card-title mb-0">{product.title.substring(0, 50)}...</h5>
                                <h4 className="card-text">
                                    ₹{product.price} <span className="tfprice">M.R.P</span> <span className="wrongprice tfprice">
                                        ₹{product.discountedPrice}
                                    </span>
                                </h4>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Buy;
