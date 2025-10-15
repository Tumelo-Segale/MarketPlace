import React from 'react';
import '../components/AdminNavbar.css';
import { NavLink } from "react-router-dom";
import Dashboard from '../assets/FarmerDashboardIcon.png';
import Farmer from '../assets/FarmerIcon.png';
import OrdersIcon from '../assets/OrdersIcon.png';
import AddProduct from '../assets/AddProductIcon.png';
import LogOut from '../assets/LogOutIcon.png';

export default function AdminNavbar() {
    return (
        <div className="admin-menu-contents">
            <div className="admin-menu-items">
                <NavLink to="/AdminDashboard" className={({ isActive }) => `admin-icon-link ${isActive ? 'active' : ''}`}>
                    <img src={Dashboard} alt="Dashboard" />
                </NavLink>

                <NavLink to="/AdminOrders" className={({ isActive }) => `admin-icon-link ${isActive ? 'active' : ''}`}>
                    <img src={OrdersIcon} alt="completed-orders" />
                </NavLink>

                <NavLink to="/AdminFarmers" className={({ isActive }) => `admin-icon-link ${isActive ? 'active' : ''}`}>
                    <img src={Farmer} alt="farmers-registered" />
                </NavLink>

                <NavLink to="/" className={({ isActive }) => `admin-icon-link ${isActive ? 'active' : ''}`}>
                    <img src={LogOut} />
                </NavLink>
            </div>
        </div>
    )
}
