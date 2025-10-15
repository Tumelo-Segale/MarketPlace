import React, { useEffect, useState } from "react";
import "./Farmer-Styles/FarmerOrders.css";

export default function FarmerOrders() {
    const [orders, setOrders] = useState([]);
    const [farmName, setFarmName] = useState("");

    useEffect(() => {
        const storedFarmName = localStorage.getItem("farmName");
        if (storedFarmName) setFarmName(storedFarmName);

        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const farmerOrders = savedOrders.filter((order) =>
        order.items?.some((item) => item.farmer === storedFarmName)
        );

        setOrders([...farmerOrders].reverse());
    }, []);

    const handleCompleteOrder = (orderId) => {
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

        const updatedOrders = savedOrders.map((order) => {
        if (order.id === orderId) {
            return { ...order, completed: true };
        }
        return order;
        });

        localStorage.setItem("orders", JSON.stringify(updatedOrders));

        const farmerOrders = updatedOrders.filter((order) =>
        order.items?.some((item) => item.farmer === farmName)
        );
        setOrders([...farmerOrders].reverse());

        window.dispatchEvent(new Event("storage"));
    };

    const calculateFarmerTotal = (order) => {
        const farmerItems = order.items.filter((item) => item.farmer === farmName);
        const total = farmerItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
        );
        const profit = total * 0.9; // 10% transaction fee deduction
        return { total, profit };
    };

    return (
        <div className="farmer-orders-container">
        <h2>{farmName} ORDERS</h2>

        {orders.length === 0 ? (
            <p className="no-orders">No orders yet.</p>
        ) : (
            <div className="order-grid">
            {orders.map((order) => {
                const { total, profit } = calculateFarmerTotal(order);

                return (
                <div key={order.id} className="order-card">
                    <h3 className="order-no">{order.id}</h3>
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

                    {order.user?.message && (
                    <p className="customer-message">
                        <strong>Message:</strong> {order.user.message}
                    </p>
                    )}

                    <ul className="order-items-list">
                    {order.items
                        .filter((item) => item.farmer === farmName)
                        .map((item) => (
                        <li key={item.id}>
                            {item.name} × {item.quantity}{" "}
                            <strong>R{(item.price * item.quantity).toFixed(2)}</strong>
                        </li>
                        ))}
                    </ul>

                    <p className="total">
                    <strong>TOTAL:</strong> R{total.toFixed(2)}
                    </p>
                    <p className="total">
                    <strong>PROFIT:</strong> R{profit.toFixed(2)}
                    </p>

                    <p className={order.completed ? "status-complete" : "status-pending"}>
                    {order.completed ? " Completed" : " Pending"}
                    </p>

                    {!order.completed && (
                    <button
                        className="complete-order-btn"
                        onClick={() => handleCompleteOrder(order.id)}
                    >
                        COMPLETE ORDER
                    </button>
                    )}
                </div>
                );
            })}
            </div>
        )}
        </div>
    );
}
