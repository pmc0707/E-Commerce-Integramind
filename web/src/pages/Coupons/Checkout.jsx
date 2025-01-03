// src/components/Checkout.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Checkout = () => {
    const [couponCode, setCouponCode] = useState('');
    const [cartValue, setCartValue] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [error, setError] = useState('');

    const handleApplyCoupon = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/coupons');
            const coupon = response.data.find(coupon => coupon.coupon_code === couponCode && coupon.status === 'active');

            if (coupon) {
                if (cartValue >= coupon.cart_minimum) {
                    const discountAmount = coupon.coupon_type === 'percentage' ? (coupon.coupon_value / 100) * cartValue : coupon.coupon_value;
                    setDiscount(discountAmount);
                    setError('');
                } else {
                    setError(`Cart value must be at least ₹${coupon.cart_minimum} to apply this coupon.`);
                }
            } else {
                setError('Invalid or inactive coupon.');
            }
        } catch (error) {
            console.error('Error applying coupon', error);
            setError('Error applying coupon. Please try again.');
        }
    };

    return (
        <div className="checkout">
            <h2>Checkout</h2>
            <label>
                Cart Value: ₹
                <input
                    type="number"
                    value={cartValue}
                    onChange={(e) => setCartValue(e.target.value)}
                />
            </label>
            <br />
            <label>
                Coupon Code:
                <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                />
            </label>
            <button onClick={handleApplyCoupon}>Apply Coupon</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {discount > 0 && <p>Discount Applied: ₹{discount}</p>}
            <p>Total  after discount: ₹{cartValue - discount}</p>
        </div>
    );
};

export default Checkout;
