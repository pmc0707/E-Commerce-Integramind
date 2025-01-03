import React from 'react';
import './Features.css';  

const Features = () => {
  return (
    <div className="features-container">
      <div className="feature-item">
        <i className="feature-icon lock-icon"></i>
        <h3>Secure Payments</h3>
        <p>Shop with confidence knowing that your transactions are safeguarded.</p>
      </div>

      <div className="feature-item">
        <i className="feature-icon shipping-icon"></i>
        <h3>Free Shipping</h3>
        <p>Shopping with no extra charges – savor the liberty of complimentary shipping on every order.</p>
      </div>

      <div className="feature-item">
        <i className="feature-icon returns-icon"></i>
        <h3>Easy Returns</h3>
        <p>With our hassle-free Easy Returns, changing your mind has never been more convenient.</p>
      </div>

      <div className="feature-item">
        <i className="feature-icon tracking-icon"></i>
        <h3>Order Tracking</h3>
        <p>Stay in the loop with our Order Tracking feature – from checkout to your doorstep.</p>
      </div>
    </div>
  );
};

export default Features;
