import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserCoupons.css';  

const UserCoupons = () => {
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/coupons');
                const activeCoupons = response.data.filter(coupon => coupon.status === 'active');
                setCoupons(activeCoupons);
            } catch (error) {
                console.error('Error fetching coupons', error);
            }
        };
        fetchCoupons();
    }, []);

    return (
        <div className="user-coupons">
            <h2>Available Coupons</h2>
            <ul>
                {coupons.map((coupon) => (
                    <li key={coupon._id}>
                        <strong>Code:</strong> {coupon.coupon_code}<br />
                        <strong>Discount:</strong> {coupon.coupon_type === 'percentage' ? `${coupon.coupon_value}%` : `₹${coupon.coupon_value}`}<br />
                        <strong>Minimum Cart Value:</strong> ₹{coupon.cart_minimum}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserCoupons;
