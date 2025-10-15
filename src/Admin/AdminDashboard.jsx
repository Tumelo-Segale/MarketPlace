import React, { useEffect, useState } from "react";
import "./Admin-Styles/AdminDashboard.css";

export default function AdminDashboard() {
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalFarmers, setTotalFarmers] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const updateStats = () => {
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
        const savedFarmers = JSON.parse(localStorage.getItem("farmers")) || [];

        // Count orders completed
        const completedOrders = savedOrders.filter(order => order.completed).length;
        setTotalOrders(completedOrders);

        // Count farmers
        setTotalFarmers(savedFarmers.length);

        // Count total items (all farmers' products)
        setTotalItems(savedProducts.length);

        // Calculate total revenue and platform profit
        let totalRevenueCalc = 0;
        let totalProfitCalc = 0;

        savedOrders.forEach(order => {
            const orderTotal = order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

            if (order.completed) {
                totalRevenueCalc += orderTotal;

                // Platform earns: R3 + 10% per transaction
                totalProfitCalc += 3 + (orderTotal * 0.1);
            }
        });

        setTotalRevenue(totalRevenueCalc);
        setTotalProfit(totalProfitCalc);
    };

    useEffect(() => {
        updateStats();
        const handleStorageChange = () => updateStats();
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isAdminLoggedIn");
    };

    const handleCreateBatchEFT = () => {
        // Placeholder action for now
        alert("Batch EFT file created successfully (simulation).");
        // In the future: generate .csv or .txt file with farmer payout info
    };

    return (
        <div className="admin-main-page">
            <h1 className="admin-title">ADMIN DASHBOARD</h1>

            <div className="admin-dashboard-container">
                <div className="admin-stats-card">
                    <h3>PLATFORM OVERVIEW</h3>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <span className="stat-label">Completed Orders</span>
                            <span className="stat-value">{totalOrders}</span>
                        </div>

                        <div className="stat-box">
                            <span className="stat-label">Farmers Registered</span>
                            <span className="stat-value">{totalFarmers}</span>
                        </div>

                        <div className="stat-box">
                            <span className="stat-label">Total Revenue</span>
                            <span className="stat-value">R{totalRevenue.toFixed(2)}</span>
                        </div>

                        <div className="stat-box">
                            <span className="stat-label">Platform Profit</span>
                            <span className="stat-value">R{totalProfit.toFixed(2)}</span>
                        </div>

                        <div className="stat-box">
                            <span className="stat-label">Total Items</span>
                            <span className="stat-value">{totalItems}</span>
                        </div>
                    </div>
                </div>
                                    {/* Batch EFT Button */}
                <div className="eft-button-container">
                    <button className="batch-eft-btn" onClick={handleCreateBatchEFT}>
                        CREATE BATCH FILE
                    </button>
                </div>
            </div>
        </div>
    );
}
