import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landingPage.css';
import Features from './Features';
import Footer from './Footer';
import Collaborate from './Collaborate';
import HeroSection from './HeroSection';

const LandingPage = () => {

  const navigate = useNavigate();
  const handleViewCollection = () => {
    navigate('/orders');
  };

  return (
    <>
    <div className="landing-page">
      <div className="landing-page-overlay">
        <div className="landing-page-content">
          <p className="landing-tagline">CASUAL & EVERYDAY</p>
          <h1 className="landing-title">Effortlessly Blend Comfort & Style!</h1>
          <p className="landing-description">
            Effortlessly blend comfort and style with our Casual & Everyday collection, featuring cozy sweaters, versatile denim, laid-back tees, and relaxed-fit joggers for your everyday adventures.
          </p>
         
          <button onClick={handleViewCollection} className="landing-button">VIEW COLLECTION</button>
        </div>
      </div>
     
    </div>
    
    <HeroSection />
    <Features />
    <Collaborate />
    <Footer />
    </>
  );
};

export default LandingPage;
