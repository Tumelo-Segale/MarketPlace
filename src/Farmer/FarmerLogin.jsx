import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import FarmerLoginLogo from '../assets/Logo-noName.png';
import './Farmer-Styles/FarmerLogin.css';
import axios from "axios";

export default function FarmerLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        contactNumber: "",
        password: ""
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Check form validity
    useEffect(() => {
        const validContact = /^[0-9]{10}$/.test(formData.contactNumber);
        const validPassword = formData.password.trim() !== "";
        setIsFormValid(validContact && validPassword);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "contactNumber" && !/^[0-9]*$/.test(value)) return;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { contactNumber, password } = formData;
        setLoading(true);
        setError("");

        try {
            // Use the unified login endpoint that checks both admin and farmer
            const response = await axios.post("http://localhost:5000/api/login", { 
                contactNumber, 
                password 
            });
            
            if (response.data.success) {
                if (response.data.userType === "admin") {
                    // Handle admin login
                    localStorage.setItem("isAdminLoggedIn", "true");
                    localStorage.setItem("adminUser", JSON.stringify(response.data.user));
                    alert("Welcome Admin!");
                    navigate("/AdminDashboard");
                } else if (response.data.userType === "farmer") {
                    // Handle farmer login
                    const farmer = response.data.user;
                    
                    localStorage.setItem("activeFarmer", JSON.stringify({
                        farmName: farmer.farmName,
                        fullName: farmer.fullName,
                        contactNumber: farmer.contactNumber
                    }));
                    localStorage.setItem("farmName", farmer.farmName);
                    
                    alert(`Welcome back, ${farmer.farmName}!`);
                    navigate(`/FarmerDashboard/${farmer.farmName}`);
                }
            } else {
                setError(response.data.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login error:", err);
            if (err.code === 'ECONNREFUSED') {
                setError("Cannot connect to server. Please make sure the backend is running on localhost:5000");
            } else if (err.response) {
                // Server responded with error status
                if (err.response.status === 400) {
                    setError("Invalid input. Please check your contact number and password.");
                } else if (err.response.status === 500) {
                    setError("Server error. Please try again later.");
                } else {
                    setError(err.response.data.message || "Login failed");
                }
            } else if (err.request) {
                setError("No response from server. Please check if backend is running.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterRedirect = () => {
        navigate("/FarmerRegistration");
    };

    return (
        <>
            <div className="registration-title">
                <NavLink to="/"><img src={FarmerLoginLogo} alt="Logo" /></NavLink>
                <h1>LOGIN</h1>
            </div>

            <form onSubmit={handleLogin} className="login-form">
                <div className="details">
                    <label htmlFor="ContactNumber">Contact Number:</label>
                    <input
                        type="tel"
                        name="contactNumber"
                        id="ContactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        maxLength={10}
                        placeholder="e.g. 0987654321"
                        required
                        disabled={loading}
                    />
                    {formData.contactNumber.length > 0 &&
                        formData.contactNumber.length !== 10 && (
                        <small style={{ color: "red", paddingBottom: "10px", marginTop: "0px" }}>
                            Contact number must be 10 digits
                        </small>
                        )}
                </div>

                <div className="details">
                    <label htmlFor="Password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        id="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="Enter your password"
                    />
                </div>

                {error && <p style={{ color: "red", fontSize: "20px", margin: "0px" }}>{error}</p>}

                <div className="form-buttons">
                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={isFormValid && !loading ? "active-btn" : "disabled-btn"}
                    >
                        {loading ? "LOGGING IN..." : "LOGIN"}
                    </button>

                    <button 
                        type="button" 
                        onClick={handleRegisterRedirect}
                        disabled={loading}
                    >
                        REGISTER
                    </button>
                </div>
            </form>
        </>
    );
}