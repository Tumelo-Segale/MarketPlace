import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import FarmerRegistrationLogo from "../assets/Logo-noName.png";
import "./Farmer-Styles/FarmerRegistration.css";
import axios from "axios";

// Create axios instance with better error handling
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    });

    export default function FarmerRegistration() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        farmName: "",
        contactNumber: "",
        password: "",
        description: "",
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [agreeChecked, setAgreeChecked] = useState(false);
    const [pendingFarmer, setPendingFarmer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Validate form
    useEffect(() => {
        const { fullName, farmName, contactNumber, password } = formData;
        const validContact = /^[0-9]{10}$/.test(contactNumber);
        setIsFormValid(Boolean(fullName && farmName && validContact && password));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "contactNumber" && !/^[0-9]*$/.test(value)) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(""); // Clear error when user types
    };

    // Test backend connection
    const testBackendConnection = async () => {
        try {
        const response = await api.get('/test');
        console.log('Backend connection test:', response.data);
        return true;
        } catch (error) {
        console.error('Backend connection failed:', error);
        return false;
        }
    };

    // Submit registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!isFormValid) {
        setError("Please complete all required fields correctly.");
        return;
        }

        setLoading(true);

        try {
        // Test backend connection first
        const isBackendConnected = await testBackendConnection();
        if (!isBackendConnected) {
            setError("Cannot connect to server. Please make sure the backend is running on localhost:5000");
            setLoading(false);
            return;
        }

        const res = await api.post("/farmers/check", {
            farmName: formData.farmName,
        });

        if (res.data.exists) {
            setError("A farm with this name already exists. Please choose a different name.");
            setLoading(false);
            return;
        }

        const newFarmer = { ...formData };
        setPendingFarmer(newFarmer);
        setShowTerms(true);
        } catch (err) {
        console.error("Registration error:", err);
        if (err.code === 'ECONNREFUSED') {
            setError("Cannot connect to server. Please make sure the backend is running on localhost:5000");
        } else if (err.response) {
            setError(`Server error: ${err.response.data.error || err.response.statusText}`);
        } else if (err.request) {
            setError("No response from server. Please check if backend is running.");
        } else {
            setError("An unexpected error occurred. Please try again.");
        }
        } finally {
        setLoading(false);
        }
    };

    // Proceed after agreeing to terms - NAVIGATES TO DASHBOARD
    const handleProceed = async () => {
        if (!agreeChecked) {
        setError("You must agree to the terms to proceed.");
        return;
        }

        setLoading(true);

        try {
        const res = await api.post("/farmers/register", pendingFarmer);

        if (res.data.success) {
            // Store farmer data in localStorage
            localStorage.setItem("activeFarmer", JSON.stringify({
            farmName: pendingFarmer.farmName,
            fullName: pendingFarmer.fullName,
            contactNumber: pendingFarmer.contactNumber
            }));
            localStorage.setItem("farmName", pendingFarmer.farmName);
            
            alert(`Welcome, ${pendingFarmer.farmName}! Registration successful.`);
            
            // NAVIGATE TO DASHBOARD
            navigate(`/FarmerDashboard/${pendingFarmer.farmName}`);
        } else {
            setError("Registration failed. Please try again.");
        }
        } catch (err) {
        console.error("Registration error:", err);
        if (err.response) {
            setError(`Registration failed: ${err.response.data.error || "Please try again."}`);
        } else {
            setError("Server error during registration. Please try again.");
        }
        } finally {
        setLoading(false);
        }
    };

    // Navigate to login page
    const handleLoginRedirect = () => {
        navigate("/FarmerLogin");
    };

    return (
        <>
        <div className="registration-title">
            <NavLink to="/">
            <img src={FarmerRegistrationLogo} alt="Logo" />
            </NavLink>
            <h1>REGISTER</h1>
        </div>

        {error && (
            <div style={{ 
            color: "red", 
            textAlign: "center", 
            padding: "10px",
            margin: "10px",
            backgroundColor: "#ffe6e6",
            border: "1px solid red",
            borderRadius: "5px"
            }}>
            {error}
            </div>
        )}

        <div className="registration-form">
            <form onSubmit={handleRegister}>
            <div className="details">
                <label>Full Name:</label>
                <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
                />
            </div>

            <div className="details">
                <label>Farm Name:</label>
                <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                required
                disabled={loading}
                />
            </div>

            <div className="details">
                <label>Contact Number:</label>
                <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                maxLength={10}
                required
                disabled={loading}
                />
                {formData.contactNumber.length > 0 &&
                formData.contactNumber.length !== 10 && (
                    <small style={{ color: "red" }}>Contact number must be 10 digits</small>
                )}
            </div>

            <div className="details">
                <label>Password:</label>
                <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                />
            </div>

            <div className="details">
                <label>Description:</label>
                <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="(Optional)"
                disabled={loading}
                />
            </div>

            <div className="form-buttons">
                <button
                type="submit"
                disabled={!isFormValid || loading}
                className={isFormValid && !loading ? "active-btn" : "disabled-btn"}
                >
                {loading ? "CHECKING..." : "REGISTER"}
                </button>
                <button type="button" onClick={handleLoginRedirect} disabled={loading}>
                LOGIN
                </button>
            </div>
            </form>
        </div>

        {showTerms && (
            <div className="terms-overlay">
            <div className="terms-modal">
                <h2>Terms & Conditions</h2>
                <ul>
                <li>Your farm data will be stored securely for platform use.</li>
                <li>All transactions must comply with our fair trade policy.</li>
                <li>You must use your legal bank account name.</li>
                <li>10% platform fee applies per transaction.</li>
                </ul>

                <label>
                <input
                    type="checkbox"
                    checked={agreeChecked}
                    onChange={(e) => setAgreeChecked(e.target.checked)}
                    disabled={loading}
                />
                I agree to the terms and conditions
                </label>

                <div className="terms-buttons">
                <button onClick={() => setShowTerms(false)} disabled={loading}>
                    Cancel
                </button>
                <button
                    disabled={!agreeChecked || loading}
                    onClick={handleProceed}
                    className={agreeChecked && !loading ? "active-btn" : "disabled-btn"}
                >
                    {loading ? "PROCESSING..." : "Proceed"}
                </button>
                </div>
            </div>
            </div>
        )}
        </>
    );
}