import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import FarmerRegistrationLogo from '../assets/Logo-noName.png';
import './Farmer-Styles/FarmerRegistration.css';

export default function FarmerRegistration() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        farmName: "",
        contactNumber: "",
        password: "",
        description: ""
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [agreeChecked, setAgreeChecked] = useState(false);
    const [pendingFarmer, setPendingFarmer] = useState(null); // temp storage before confirming terms

    // Validate all required fields dynamically
    useEffect(() => {
        const { fullName, farmName, contactNumber, password } = formData;
        const validContact = /^[0-9]{10}$/.test(contactNumber);
        setIsFormValid(!!(fullName && farmName && validContact && password));
    }, [formData]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "contactNumber" && !/^[0-9]*$/.test(value)) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Registration Submit (show terms instead of immediate register)
    const handleRegister = (e) => {
        e.preventDefault();

        if (!isFormValid) {
        alert("Please complete all required fields correctly.");
        return;
        }

        const existingFarmers = JSON.parse(localStorage.getItem("farmers")) || [];

        // Check for duplicate farm name
        const farmExists = existingFarmers.some(
        (farmer) => farmer.farmName.toLowerCase() === formData.farmName.toLowerCase()
        );
        if (farmExists) {
        alert("A farm with this name already exists. Please choose a different name.");
        return;
        }

        // Temporarily store farmer before confirming
        const newFarmer = {
        ...formData,
        id: `FARM-${Date.now()}`,
        createdAt: new Date().toISOString(),
        };
        setPendingFarmer(newFarmer);
        setShowTerms(true);
    };

    // Confirm registration after agreeing to terms
    const handleProceed = () => {
        if (!agreeChecked) return;

        const existingFarmers = JSON.parse(localStorage.getItem("farmers")) || [];
        const newFarmer = pendingFarmer;

        // Save farmer info
        localStorage.setItem("farmers", JSON.stringify([...existingFarmers, newFarmer]));
        localStorage.setItem("farmName", newFarmer.farmName);
        localStorage.setItem("activeFarmer", JSON.stringify(newFarmer));

        alert(`Welcome, ${newFarmer.farmName}! Registration successful.`);
        setShowTerms(false);
        navigate("/FarmerDashboard");
    };

    const handleLoginRedirect = () => navigate("/FarmerLogin");

    return (
        <>
        <div className="registration-title">
            <NavLink to="/"><img src={FarmerRegistrationLogo} alt="Logo" /></NavLink>
            <h1>REGISTER</h1>
        </div>

        <div className="registration-form">
            <form onSubmit={handleRegister}>
                <div className="details">
                    <label htmlFor="Farmer-FullName">Full Name:</label>
                    <input type="text" name="fullName" id="Farmer-FullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. John Doe" required />
                </div>

                <div className="details">
                    <label htmlFor="FarmName">Farm Name:</label>
                    <input type="text" name="farmName" id="FarmName" value={formData.farmName} onChange={handleChange} placeholder="e.g. Farm2Table" required />
                </div>

                <div className="details">
                    <label htmlFor="ContactNumber">Contact Number:</label>
                    <input type="tel" name="contactNumber" id="ContactNumber" value={formData.contactNumber} onChange={handleChange} maxLength="10" placeholder="e.g. 0987654321" required />
                        {formData.contactNumber.length > 0 && formData.contactNumber.length !== 10 && (
                        <small style={{ color: "red" }}>Contact number must be 10 digits</small>
                        )}
                </div>

                <div className="details">
                    <label htmlFor="Password">Password:</label>
                    <input type="password" name="password" id="Password" value={formData.password} onChange={handleChange} required />
                </div>

                <div className="details">
                    <label htmlFor="Description">Farm Description:</label>
                    <textarea name="description" id="Description" value={formData.description} onChange={handleChange} placeholder="(Optional)" ></textarea>
                </div>

                <div className="form-buttons">
                    <button type="submit" disabled={!isFormValid} className={isFormValid ? "active-btn" : "disabled-btn"} >
                    REGISTER
                    </button>
                    <button type="button" onClick={handleLoginRedirect}>
                    LOGIN
                    </button>
                </div>
            </form>
        </div>

        {/* TERMS & CONDITIONS MODAL */}
        {showTerms && (
            <div className="terms-overlay">
                <div className="terms-modal">
                    <h2>Terms & Conditions</h2>
                    <div className="terms-content">
                        <p>
                            Welcome to <b>CropCart</b>. By proceeding, you agree to the following:
                        </p>
                        <ul className="terms">
                            <li>Your farm data will be stored securely for platform use.</li>
                            <li>All transactions must comply with our fair trade policy.</li>
                            <li>You are responsible for accurate listing and pricing of your products.</li>
                            <li>Violation of platform rules may result in account suspension.</li>
                            <li>Ensure you use your legal names that correspond with your Bank Account to simplify payments.</li>
                            <li>You will be charged a 10% fee on every transaction.</li>
                            <li>Payments will be made every week.</li>
                        </ul>
                        <p>Read and Understand these terms before continuing.</p>
                    </div>

                    <div className="terms-actions">
                        <label className="agree-checkbox">
                            <input type="checkbox" checked={agreeChecked} onChange={(e) => setAgreeChecked(e.target.checked)} />
                            {" "}
                                I agree to the terms and conditions
                        </label>

                        <div className="terms-buttons">
                            <button onClick={() => setShowTerms(false)}>Cancel</button>
                            <button className={agreeChecked ? "active-btn" : "disabled-btn"} onClick={handleProceed} disabled={!agreeChecked}>
                            Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
