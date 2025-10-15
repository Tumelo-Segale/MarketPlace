import React from 'react';
import '../components/FarmerNavbar.css';
import { NavLink } from "react-router-dom";
import Dashboard from '../assets/FarmerDashboardIcon.png';
import Profile from '../assets/ProfileIcon.png';
import Product from '../assets/ProductIcon.png'
import OrdersIcon from '../assets/OrdersIcon.png';
import AddProduct from '../assets/AddProductIcon.png';

export default function FarmerNavbar() {
    return (
        <div className="farmer-menu-contents">
            <div className="farmer-menu-items">
                <NavLink to="/FarmerDashboard" className={({ isActive }) => `farmer-icon-link ${isActive ? 'active' : ''}`}>
                    <img src={Dashboard} alt="Dashboard" />
                </NavLink>

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
