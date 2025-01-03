import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./CouponList.css";

const CouponList = () => {
    const [coupons, setCoupons] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/coupons');
                setCoupons(response.data);
            } catch (error) {
                console.error('Error fetching coupons', error);
            }
        };
        fetchCoupons();
    }, []);

    const handleEdit = (couponId) => {
        navigate(`/edit-coupon/${couponId}`);
    };

    return (
        <div>
            <h2 className='coupons-head'>Coupons</h2>
            <ul  className='coupons-ul'>
                {coupons.map((coupon) => (
                    <li className='coupons-li' key={coupon.id}>
                        Code: {coupon.coupon_code}, Value: {coupon.coupon_value} ({coupon.coupon_type}), 
                        Min Cart: {coupon.cart_minimum}, Status: {coupon.status}

                        <button className='edit-button' onClick={() => handleEdit(coupon._id)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CouponList;