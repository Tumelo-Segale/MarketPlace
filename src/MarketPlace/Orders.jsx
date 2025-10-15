import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./MarketPlace-Styles/Orders.css";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [showBanner, setShowBanner] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Load saved orders (latest first)
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        setOrders([...savedOrders].reverse()); // Reverse to show latest on top

        // Check for PayFast success from URL
        const params = new URLSearchParams(location.search);
        if (params.get("paymentSuccess") === "true") {
            setShowBanner(true);
            setTimeout(() => setShowBanner(false), 3000);
        }
    }, [location]);

    return (
        <div className="orders-container">
            {/* Success Banner */}
            {showBanner && (
                <div className="success-banner">
                    Payment Successful!
                </div>
            )}

            <h2>ORDERS</h2>

            {/* Empty State */}
            {orders.length === 0 ? (
                <p className="no-orders">No orders yet.</p>
            ) : (
                <div className="order-grid">
                    {orders.map((order) => {
                        const farmerName =
                            order.items && order.items.length > 0
                                ? order.items[0].farmer
                                : "Unknown";

                        return (
                            <div key={order.id} className="order-card">
                                <h3>{order.id}</h3>
                                <p className="date">
                                    <strong>Date:</strong>{" "}
                                    {new Date(order.date).toLocaleDateString(undefined, {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                                <p className="customer">
                                    <strong>Customer:</strong> {order.user?.fullName || "N/A"}
                                </p>
                                <p className="customer-contact">
                                    <strong>Contact:</strong> {order.user?.contact || "N/A"}
                                </p>
                                <p className="farmer">
                                    <strong>Farmer:</strong> {farmerName}
                                </p>

                                <ul>
                                    {order.items.map((item) => (
                                        <li key={item.id}>
                                            {item.name} × {item.quantity}{" "}
                                            <strong>R{item.price * item.quantity}</strong>
                                        </li>
                                    ))}
                                </ul>

                                <p className="total">
                                    TOTAL: <span>R{order.total.toFixed(2)}</span>
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
