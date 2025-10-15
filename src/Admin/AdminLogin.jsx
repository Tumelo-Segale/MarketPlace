import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AdminLoginLogo from "../assets/Logo-noName.png";
import "./Admin-Styles/AdminLogin.css";

export default function AdminLogin() {
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const correctPin = "886356";

    // Only allow digits and limit to 6
    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,6}$/.test(value)) {
            setPin(value);
            setError(""); // clear error when typing
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (pin === correctPin) {
            localStorage.setItem("isAdminLoggedIn", "true");
            navigate("/AdminDashboard");
        } else {
            setError("Incorrect PIN. Please try again.");
        }
    };

    return (
        <>
            <div className="admin-title">
                <NavLink to="/">
                    <img src={AdminLoginLogo} alt="Logo" />
                </NavLink>
                <h1>ADMIN</h1>
            </div>

            <div className="admin-page-content">
                <div className="admin-login-container">
                    <form className="admin-login-form" onSubmit={handleLogin}>
                        <label htmlFor="admin-pin"></label>
                        <input type="password" id="admin-pin" name="admin-pin" value={pin} onChange={handleChange} maxLength="6" inputMode="numeric" pattern="\d{6}" placeholder="Enter PIN" />

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" disabled={pin.length !== 6} className={pin.length === 6 ? "active-btn" : "disabled-btn"} >
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
