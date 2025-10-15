import React, { useEffect, useState } from "react";
import "./Admin-Styles/AdminOrder.css";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const completedOrders = savedOrders.filter((order) => order.completed);
        setOrders([...completedOrders].reverse());
    }, []);

    const filteredOrders = orders.filter((order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-orders-container">
            <h2>COMPLETED ORDERS</h2>

            <input type="text" placeholder="Search by Order Number..." className="search-bar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

            {filteredOrders.length === 0 ? (
                <p className="no-orders">No completed orders found.</p>
            ) : (
                <div className="order-list">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="order-summary" onClick={() => setSelectedOrder(order)} >
                            <h3>{order.id}</h3>
                            <p>
                                {new Date(order.date).toLocaleDateString(undefined, {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Popup Modal */}
            {selectedOrder && (
                <div className="order-popup-overlay">
                    <div className="order-popup">
                        <h3>{selectedOrder.id}</h3>
                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(selectedOrder.date).toLocaleDateString(undefined, {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                        <p>
                            <strong>Customer:</strong>{" "}
                            {selectedOrder.user?.fullName || "N/A"}
                        </p>
                        <p>
                            <strong>Contact:</strong>{" "}
                            {selectedOrder.user?.contact || "N/A"}
                        </p>
                        {selectedOrder.user?.message && (
                            <p>
                                <strong>Message:</strong> {selectedOrder.user.message}
                            </p>
                        )}

                        {/* Show farmer once */}
                        {selectedOrder.items.length > 0 && (
                            <>
                                <p className="farm-name">
                                    <strong>Farmer:</strong> {selectedOrder.items[0].farmer}
                                </p>
                                <ul className="order-items-list">
                                    {selectedOrder.items.map((item) => (
                                        <li key={item.id}>
                                            {item.name} × {item.quantity} {" "}
                                            <strong>R{(item.price * item.quantity).toFixed(2)}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        <p className="order-total">
                            TOTAL:{" "}
                            R
                            {selectedOrder.items
                                .reduce(
                                    (sum, item) => sum + item.price * item.quantity,
                                    0
                                )
                                .toFixed(2)}
                        </p>

                        <button className="close-popup-btn" onClick={() => setSelectedOrder(null)} >
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
