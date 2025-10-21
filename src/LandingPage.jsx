import React from 'react';
import Logo from './assets/Logo-name.png';
import { NavLink } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
    return (
        <>
            <div className="page-content">
                <div className="logo">
                    <img src={Logo} alt="Logo" />
                </div>
                <div className="Links">
                    <div className="Buttons">
                        <NavLink to={"/MarketPlace"}><button>Browse Market</button></NavLink>
                    </div>
                    <div className="Buttons">
                        <NavLink to={"/FarmerRegistration"}><button>I'm a Farmer</button></NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}
