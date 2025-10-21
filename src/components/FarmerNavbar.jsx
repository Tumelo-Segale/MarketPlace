import React from 'react';
import '../components/FarmerNavbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import Dashboard from '../assets/FarmerDashboardIcon.png';
import Profile from '../assets/ProfileIcon.png';
import Product from '../assets/ProductIcon.png'
import OrdersIcon from '../assets/OrdersIcon.png';
import AddProduct from '../assets/AddProductIcon.png';

export default function FarmerNavbar() {
    const navigate = useNavigate();

    const handleDashboardClick = () => {
        // Get farmName from localStorage and navigate to the correct dashboard URL
        const farmName = localStorage.getItem("farmName");
        if (farmName) {
            navigate(`/FarmerDashboard/${farmName}`);
        } else {
            // Fallback - redirect to login if no farmName found
            navigate("/FarmerLogin");
        }
    };

    return (
        <div className="farmer-menu-contents">
            <div className="farmer-menu-items">
                {/* Dashboard with custom click handler */}
                <div 
                    onClick={handleDashboardClick}
                    className="farmer-icon-link"
                    style={{ cursor: 'pointer' }}
                >
                    <img src={Dashboard} alt="Dashboard" />
                </div>

                {/* Other links remain the same */}
                <NavLink to="/FarmerOrders" className={({ isActive }) => `farmer-icon-link ${isActive ? 'active' : ''}`}>
                    <img src={OrdersIcon} alt="Orders" />
                </NavLink>

                <NavLink to="/FarmerProducts" className={({ isActive }) => `farmer-icon-link ${isActive ? 'active' : ''}`}>
                    <img src={Product} alt="Products" />
                </NavLink>

                <NavLink to="/FarmerAddProducts" className={({ isActive }) => `farmer-icon-link ${isActive ? 'active' : ''}`}>
                    <img src={AddProduct} alt="AddProducts" />
                </NavLink>

                <NavLink to="/FarmerProfile" className={({ isActive }) => `farmer-icon-link ${isActive ? 'active' : ''}`}>
                    <img src={Profile} alt="Profile" />
                </NavLink>
            </div>
        </div>
    )
}