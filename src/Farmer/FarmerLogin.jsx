import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import FarmerLoginLogo from '../assets/Logo-noName.png';
import './Farmer-Styles/FarmerLogin.css';

export default function FarmerLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        contactNumber: "",
        password: ""
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState("");

    // Admin credentials
    const adminContact = "0000000000";
    const adminPin = "123456";

    // Check form validity
    useEffect(() => {
        const validContact = /^[0-9]{10}$/.test(formData.contactNumber);
        setIsFormValid(validContact && formData.password.trim() !== "");
    }, [formData]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "contactNumber" && !/^[0-9]*$/.test(value)) return;

        setFormData({
            ...formData,
            [name]: value
        });
        setError("");
    };

    // Handle Login
    const handleLogin = (e) => {
        e.preventDefault();

        const { contactNumber, password } = formData;

        // ✅ Check for Admin login first
        if (contactNumber === adminContact && password === adminPin) {
            localStorage.setItem("isAdminLoggedIn", "true");
            alert("Welcome Admin!");
            navigate("/AdminDashboard");
            return;
        }

        // ✅ Check for Farmer login
        const savedFarmers = JSON.parse(localStorage.getItem("farmers")) || [];

        const match = savedFarmers.find(
            (farmer) =>
                farmer.contactNumber === contactNumber &&
                farmer.password === password
        );

        if (match) {
            localStorage.setItem("farmName", match.farmName);
            localStorage.setItem("activeFarmer", JSON.stringify(match));

            alert(`Welcome back, ${match.farmName}!`);
            navigate("/FarmerDashboard");
        } else {
            setError("Invalid contact number or password.");
        }
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
                        maxLength="10"
                        placeholder="e.g. 0987654321"
                        required
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
                    />
                </div>

                {error && <p style={{ color: "red", fontSize: "20px", margin: "0px" }}>{error}</p>}

                <div className="form-buttons">
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={isFormValid ? "active-btn" : "disabled-btn"}
                    >
                        LOGIN
                    </button>

                    <NavLink to="/FarmerRegistration">
                        <button type="button">REGISTER</button>
                    </NavLink>
                </div>
            </form>
        </>
    );
}
