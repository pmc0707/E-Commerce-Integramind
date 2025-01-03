import React, { useState } from 'react';
import './Contact.css'; 

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [responseMessage, setResponseMessage] = useState(''); // State for response message
    const [isSuccess, setIsSuccess] = useState(false); // State to track success

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Send the form data as JSON
            });
    
            const result = await response.json();
            
            if (response.ok) {
                setResponseMessage('Message sent successfully!'); // Success message
                setIsSuccess(true);
                setFormData({ name: '', email: '', message: '' }); // Reset the form
            } else {
                setResponseMessage(`Error sending message: ${result.message}`); // Error message
                setIsSuccess(false);
            }
        } catch (error) {
            setResponseMessage(`Error: ${error.message}`); // Error message
            setIsSuccess(false);
        }
    };

    return (
        <div className="contact-container-cn">
            <h1>Contact Us</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea 
                        id="message" 
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <button type="submit">Send Message</button>
            </form>
            {responseMessage && (
                <div className={isSuccess ? 'success-message' : 'error-message'}>
                    {responseMessage}
                </div>
            )}
            <div className="contact-info-cn">
                <h2>Get in Touch</h2>
                <p>Email: interashop@gmail.com</p> {/* Your email here */}
                <p>Phone: 770964857</p> {/* Replace with your phone number */}
                <p>Follow us on:</p>
                <ul>
                    <li><a href="[your-facebook-link]">Facebook</a></li>
                    <li><a href="[your-instagram-link]">Instagram</a></li>
                    <li><a href="[your-twitter-link]">Twitter</a></li>
                </ul>
            </div>
        </div>
    );
};

export default Contact;
