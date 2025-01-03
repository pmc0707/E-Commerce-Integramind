import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Footer.css"; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Contact us</h3>
                        <p>integrashop@gmail.com</p>
                        <p>GLA University, Chaumuhan </p>
                        <p>Mathura</p>
                        <p>Uttar Pradesh 281406</p>
                    </div>
                    <div className="footer-section">
                        <h3>Home</h3>
                        <p>Policy</p>
                        <p>Terms and condition</p>
                        <p>About Us</p>
                    </div>
                    <div className="footer-section social">
                        <h3>Follow us on</h3>
                        <div className="social-icons">
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                            <a href="#"><i className="fas fa-envelope"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>
                    INTEGRA SHOP is a E-Commerce plateform<br />
                    Copyright©2023 mojsenie. All rights reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;
