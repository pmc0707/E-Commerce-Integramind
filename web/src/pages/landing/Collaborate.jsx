import React from 'react';
import './Collaborate.css';
import { useNavigate } from 'react-router-dom';

const Collaborate = () => {
    const navigate = useNavigate();
    const handleViewCollection = () =>{
        navigate('/contact');
    }
  return (
    <div className="collaborate-section">
      <div className="overlay">
        <h1>Let's Collaborate</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna.
          Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae.
        </p>
        <button onClick={handleViewCollection} className="contact-button">Contact Me</button>
      </div>
    </div>
  );
};

export default Collaborate;
