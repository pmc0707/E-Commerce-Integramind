import React from 'react';
import CouponCard from './CouponCard';
import DiscountBadge from './DiscountBadge';

const CouponList = () => {
  const couponData = [
    {
      icon: 'https://example.com/icon1.png', 
      title: 'Bank Offer',
      description: '5% Unlimited Cashback on Flipkart Axis Bank Credit Card',
      link: '#',
      buttonText: 'Apply Now',
      discount: '5%'
    },
    {
      icon: 'https://example.com/icon2.png',
      title: 'Bank Offer',
      description: '10% off up to ₹1,500 on IDFC FIRST Bank Credit EMI Txns on orders of ₹5,000 and above',
      link: '#',
      buttonText: 'Check Eligibility',
      discount: '10%'
    },
    {
      icon: 'https://example.com/icon3.png',
      title: 'Bank Offer',
      description: 'Flat ₹1,000 off on OneCard Credit Card EMI transactions on orders of ₹10,000 and above',
      link: '#',
      buttonText: 'Grab Now',
      discount: '₹1000'
    },
    {
      icon: 'https://example.com/icon4.png',
      title: 'Special Price',
      description: 'Get extra 16% off (price inclusive of cashback/coupon)',
      link: '#',
      buttonText: 'View Offer',
      discount: '16%'
    },
    {
      icon: 'https://example.com/icon5.png',
      title: 'No Cost EMI',
      description: 'No cost EMI ₹3,917/month. Standard EMI also available',
      link: '#',
      buttonText: 'View Plans',
      discount: 'EMI'
    },
    {
      icon: 'https://example.com/icon6.png',
      title: 'Bank Offer',
      description: 'Extra ₹500 off on IDFC FIRST Bank Credit Card EMI Transactions, Min Txn Value ₹30,000 and above',
      link: '#',
      buttonText: 'Redeem Offer',
      discount: '₹500'
    },
    {
      icon: 'https://example.com/icon7.png',
      title: 'Partner Offer',
      description: 'Make a purchase and enjoy a surprise cashback/coupon that you can redeem later!',
      link: '#',
      buttonText: 'Know More',
      discount: 'Surprise'
    },
    {
      icon: 'https://example.com/icon8.png',
      title: 'Bank Offer',
      description: '₹5,000 Instant Discount on HDFC Bank Credit EMI and Debit Card EMI Transactions',
      link: '#',
      buttonText: 'Apply Offer',
      discount: '₹5000'
    },
    {
      icon: 'https://example.com/icon9.png',
      title: 'Buy Together Offer',
      description: 'Buy Keyboard with Tablet and Get 5% off or Buy together and get 3% OFF',
      link: '#',
      buttonText: 'Shop Now',
      discount: '3%'
    },
    {
      icon: 'https://example.com/icon10.png',
      title: 'Combo Offer',
      description: 'Get Extra ₹100 Off on Combo Purchase with Canon PIXMA MG2470 All-in-One Inkjet Printer',
      link: '#',
      buttonText: 'Get Combo',
      discount: '₹100'
      
    }
  ];

  return (
    <div className="coupons-container">
      {couponData.map((coupon, index) => (
        <div className="coupon-with-badge" key={index}>
          <CouponCard 
            icon={coupon.icon}
            title={coupon.title}
            description={coupon.description}
            link={coupon.link}
            buttonText={coupon.buttonText}
          />
          <DiscountBadge discount={coupon.discount} />
        </div>
      ))}
    </div>
  );
};

export default CouponList;
