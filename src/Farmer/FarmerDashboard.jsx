import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Home from "../assets/Logo-noName.png";
import "./Farmer-Styles/FarmerDashboard.css";

export default function FarmerDashboard() {
    const [farmName, setFarmName] = useState("");
    const [completedOrders, setCompletedOrders] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [sales, setSales] = useState(0);
    const [profit, setProfit] = useState(0);
    const [products, setProducts] = useState(0);
    const navigate = useNavigate();

    const updateStats = () => {
        const storedFarmName = localStorage.getItem("farmName");
        if (!storedFarmName) {
            setFarmName("No farm selected");
            setCompletedOrders(0);
            setPendingOrders(0);
            setSales(0);
            setProfit(0);
            setProducts(0);
            return;
        }

        setFarmName(storedFarmName);

        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];

        const farmerOrders = savedOrders.filter(order =>
            order.items?.some(item => item.farmer === storedFarmName)
        );

        let completed = 0;
        let pending = 0;
        let totalSales = 0;
        let totalProfit = 0;

        farmerOrders.forEach(order => {
            const farmerItems = order.items.filter(item => item.farmer === storedFarmName);
            const orderTotal = farmerItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            if (order.completed) {
                completed++;
                totalSales += orderTotal;
                totalProfit += orderTotal * 0.9; // 10% fee
            } else {
                pending++;
            }
        });

        const farmerProducts = savedProducts.filter(p => p.farmer === storedFarmName);

        setCompletedOrders(completed);
        setPendingOrders(pending);
        setSales(totalSales);
        setProfit(totalProfit);
        setProducts(farmerProducts.length);
    };

    const handleLogout = () => {
        localStorage.removeItem("activeFarmer");
        localStorage.removeItem("farmName");
    };

    useEffect(() => {
        updateStats();
        const handleStorageEvent = () => updateStats();
        window.addEventListener("storage", handleStorageEvent);
        return () => window.removeEventListener("storage", handleStorageEvent);
    }, []);

    return (
        <div className="farmer-main-page">
            <h1 className="farmer-title">DASHBOARD</h1>

            <div className="farmer-dashboard-container">
                <div className="farmer-greeting">
                    <h2>{farmName}</h2>
                </div>

                <div className="farmer-stats-card">
                    <h3>QUICK STATS</h3>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <span className="stat-label">Completed Orders</span>
                            <span className="stat-value">{completedOrders}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Pending Orders</span>
                            <span className="stat-value">{pendingOrders}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Total Sales</span>
                            <span className="stat-value">R{sales.toFixed(2)}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Profit</span>
                            <span className="stat-value">R{profit.toFixed(2)}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Products</span>
                            <span className="stat-value">{products}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout NavLink */}
            <NavLink to="/" onClick={handleLogout}>
                <img src={Home} alt="Logout" className="LogOut" />
            </NavLink>
        </div>
    );
}
