import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="content-hero">
        <h1>I Love to Help People Feel Great about How They Look.</h1>
        <div className="hero-container">
          <img src="https://websitedemos.net/fashion-lifestyle-02/wp-content/uploads/sites/427/2020/01/the-model.jpg" alt="Fashion" className="hero-image" />
          <div className="hero-text">
            <h2>Discover Your Personal Style and the Confidence That Comes with It.</h2>
            <p>
              Tempora aliqua cillum accusamus aperiam pharetra cupidatat fermentum viverra 
              delectus quidem incidunt tempus itaque quam, id blandit dolores, proin reiciendis. 
              Nostrum proin sem veniam veritatis inceptos!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
