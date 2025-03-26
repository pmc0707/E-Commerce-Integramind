import React, { useEffect, useState } from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "@/utils/toast";

const CommonHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>(""); // State to store the userType
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchProfile();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile'); // Handle errors if the response is not okay
      }

      const data = await response.json();
      setCurrentUser(data.user);
      setUserType(data.user.userType); // Assuming the API returns a userType field
      setIsLoggedIn(true);
    } catch (error) {
      showToast("Error fetching profile", "error");
      setIsLoggedIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserType("");
    showToast("Logged out successfully", "success");
    navigate("/login");
  };

  const firstLetter = currentUser?.fullName?.charAt(0).toUpperCase() || "";

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="IntegraMinds Logo" className="logo3" />
          Integra Shop
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          {!isLoggedIn &&
          <li>
            <Link to="/orders">Products</Link>
          </li>
        }
          {isLoggedIn && userType === "admin" ? (
            <>
              <li>
                <Link to="/productList">Product List</Link>
              </li>
              <li>
                <Link to="/coupons">Coupon</Link>
              </li>
              <li>
                <Link to="/coupan-form">Create Coupon</Link>
                
              </li>
            </>
          ) : isLoggedIn && userType === "regular" ? ( // Show regular user links if userType is 'regular'
            <>
              <li>
                <Link to="/orders">Products</Link>
              </li>
              <li>
                <Link to="/user-coupons">Coupons</Link>
              </li>
            </>
          ) : null}

          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>

              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/profile" className="profile-link">
                  <div className="avatar-circle">
                    {firstLetter}
                  </div>
                </Link>
              </li>
              <li>
                <Link to="#" onClick={logout}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                  </svg>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default CommonHeader;
