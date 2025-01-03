import React, { useState, useEffect } from 'react';
import './styles.css'; 

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      const orderData = [
        {
          id: 1,
          productName: 'Smartphone',
          orderDate: '2024-10-05',
          deliveryDate: '2024-10-12',
          status: 'Out for Delivery',
          trackingDetails: [
            { date: '2024-10-07', location: 'Warehouse', status: 'Shipped' },
            { date: '2024-10-08', location: 'Hub', status: 'In Transit' },
            { date: '2024-10-10', location: 'Local Center', status: 'Out for Delivery' },
          ],
        },
        {
          id: 2,
          productName: 'Laptop',
          orderDate: '2024-09-28',
          deliveryDate: '2024-10-04',
          status: 'Delivered',
          trackingDetails: [
            { date: '2024-09-29', location: 'Warehouse', status: 'Shipped' },
            { date: '2024-10-01', location: 'Hub', status: 'In Transit' },
            { date: '2024-10-04', location: 'Home', status: 'Delivered' },
          ],
        },
      ];
      setOrders(orderData);
    };

    fetchOrders();
  }, []);

  const getProgressPercentage = (trackingDetails) => {
    const totalSteps = trackingDetails.length;
    const completedSteps = trackingDetails.filter((tracking) => tracking.status === 'Delivered').length;
    return (completedSteps / totalSteps) * 100;
  };

  return (
    <div className="order-tracking">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-info">
            <h3>{order.productName}</h3>
            <p>Ordered on: {order.orderDate}</p>
            <p>Delivery by: {order.deliveryDate}</p>
            <p>Status: <strong>{order.status}</strong></p>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${getProgressPercentage(order.trackingDetails)}%` }}
            ></div>
          </div>

          <div className="tracking-info">
            <h4>Tracking Details:</h4>
            {order.trackingDetails.map((tracking, index) => (
              <div key={index} className="tracking-step">
                <p>{tracking.date} - {tracking.location} - {tracking.status}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTracking;
