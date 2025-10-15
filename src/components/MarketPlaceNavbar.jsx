import React from 'react';
import '../components/MarketPlaceNavbar.css';
import { NavLink } from "react-router-dom";
import Logo from '../assets/Logo-noName.png';
import OrdersIcon from '../assets/OrdersIcon.png';
import HelpIcon from '../assets/HelpIcon.png';

export default function MarketPlaveNavbar() {
    return (
        <div className="menu-contents">
                <div className="menu-items">
                <NavLink to="/MarketPlace" className={({ isActive }) => `icon-link ${isActive ? 'active' : ''}`}>
                        <img src={Logo} alt="Logo" />
                    </NavLink>

                    <NavLink to="/Orders" className={({ isActive }) => `icon-link ${isActive ? 'active' : ''}`}>
                        <img src={OrdersIcon} alt="Orders" />
                    </NavLink>

                    <NavLink to="/Help" className={({ isActive }) => `icon-link ${isActive ? 'active' : ''}`}>
                        <img src={HelpIcon} alt="Help" />
                    </NavLink>
                </div>
            </div>
    )
}
