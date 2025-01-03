import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './profile.css';
import { Card } from "react-bootstrap";
import { showToast } from "@/utils/toast"; // Assuming you're using this for showing notifications

const Profile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null); // To store user profile
  const [loading, setLoading] = useState(true); // To show loading indicator
  const [error, setError] = useState(""); // To store error messages if API fails

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Get JWT token from localStorage
        const response = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Pass the token in Authorization header
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const data = await response.json();
        setCurrentUser(data.user); // Update the state with the user profile data
        setLoading(false); // Set loading to false when data is fetched

      } catch (err: any) {
        setError(err.message); // Set the error message
        setLoading(false); // Set loading to false when an error occurs
        showToast("Failed to load profile", "error");
      }
    };

    fetchProfile(); // Call the function when the component mounts
  }, []);

  const firstLetter = currentUser?.fullName?.charAt(0).toUpperCase() || "";

  if (loading) {
    return (
      <div className="profile">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile">
      <Card className="card3">
        <Card.Header as="h3" className="card-header">
          <Link to="/profile" className="profile-link">
            <div className="avatar-circle avatar-size">
              <h1 className="name">{firstLetter}</h1>
            </div>
            <p style={{ fontSize: '3vw', color: 'black' }}>
              <span style={{ fontSize: '1.2vw', color: 'black',  }}>Hello, </span>
              <br />
              {currentUser.fullName}
            </p>
          </Link>
        </Card.Header>
        <Card.Body className="card-body3">
          <Link className="a3" to="/order-history">Order History</Link>
          <Link className="a3" to="/user-coupons">Coupons</Link>
          <Link className="a3" to="/address">Address</Link>
        </Card.Body>
      </Card>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  return (
    <main>
      <Profile />
    </main>
  );
};

export default ProfilePage;
