import React from 'react';
// import './CouponCard.css'; 

const DiscountBadge = ({ discount }) => {
  return (
    <div className="discount-badge">
      {discount} OFF
    </div>
  );
};

export default DiscountBadge;
