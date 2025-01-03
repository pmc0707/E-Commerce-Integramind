import React, { useState } from "react";
import { Link } from "react-router-dom";
import { showToast } from "@/utils/toast"; // Assuming you have a showToast function
import axios from "axios";  
import "./style.css";

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("regular"); // Default userType is regular

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send the form data to the server, including userType
      const response = await axios.post('http://localhost:5000/api/register', {
        fullName,
        email,
        password,
        userType // Send userType to the backend
      });

      showToast("Registration successful", "success");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch (error) {
      showToast("Registration failed", "error");
      console.error(error);
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <div className="user-type-set">
          <button
            type="button"
            className={`user-btn ${userType === "regular" ? "active" : ""}`}
            onClick={() => setUserType("regular")}
          >
            User
          </button>
          <button
            type="button"
            className={`admin-btn ${userType === "admin" ? "active" : ""}`}
            onClick={() => setUserType("admin")}
          >
            Admin
          </button>
        </div>
        <h2>Register as {userType === "regular" ? "User" : "Admin"}</h2>

        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="register-btn" type="submit">
          Register
        </button>

        <p>Already have an account?{" "}
          <Link className="login-link" to="/login">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
