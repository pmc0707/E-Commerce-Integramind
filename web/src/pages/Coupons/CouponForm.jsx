import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CouponForm.css';

const CouponForm = () => {
    const [coupon, setCoupon] = useState({
        coupon_code: '',
        coupon_value: '',
        coupon_type: 'percentage', // or 'fixed'
        cart_minimum: '',
        status: 'active',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCoupon({ ...coupon, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/coupons', coupon);
            navigate('/coupons');
        } catch (error) {
            console.error('Error creating coupon', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="coupon_code"
                placeholder="Coupon Code"
                value={coupon.coupon_code}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="coupon_value"
                placeholder="Coupon Value"
                value={coupon.coupon_value}
                onChange={handleChange}
                required
            />
            <select name="coupon_type" value={coupon.coupon_type} onChange={handleChange}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
            </select>
            <input
                type="number"
                name="cart_minimum"
                placeholder="Minimum Cart Value"
                value={coupon.cart_minimum}
                onChange={handleChange}
                required
            />
            <select name="status" value={coupon.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
            <button type="submit">Create Coupon</button>
        </form>
    );
};

export default CouponForm;
