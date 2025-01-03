import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CouponForm.css';  

const EditCoupon = () => {
    const { id } = useParams(); 
    const [coupon, setCoupon] = useState({
        coupon_code: '',
        coupon_value: '',
        coupon_type: 'percentage',
        cart_minimum: '',
        status: 'active',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/coupons/${id}`);
                setCoupon(response.data);
            } catch (error) {
                console.error('Error fetching coupon', error);
            }
        };
        fetchCoupon();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCoupon({ ...coupon, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/coupons/${id}`, coupon);
            navigate('/coupons');
        } catch (error) {
            console.error('Error updating coupon', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Coupon</h2>
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
            <button type="submit">Update Coupon</button>
        </form>
    );
};

export default EditCoupon;
