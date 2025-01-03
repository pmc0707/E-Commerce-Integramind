import React, { useState } from 'react';
import './Address.css';

const Address = () => {
  const [address, setAddress] = useState('');

  const handleChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    console.log('Address submitted:', address);
  };

  return (
    <div className="container6">
      <h1 className="heading6">Address</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={handleChange}
          placeholder="Enter your address"
          className="input6"
        />
        <button type="submit" className="button6">Submit</button>
      </form>
    </div>
  );
};

export default Address;
