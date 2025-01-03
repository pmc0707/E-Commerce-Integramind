export const getOrders = async () => {
    const response = await fetch('/api/orders');
    return await response.json();
  };
  
  export const addOrder = async (order) => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
  };
  
  export const getReviews = async () => {
    const response = await fetch('/api/reviews');
    return await response.json();
  };
  
  export const addReview = async (review) => {
    await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });
  };
  