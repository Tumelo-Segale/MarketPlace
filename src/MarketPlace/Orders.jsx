import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./MarketPlace-Styles/Orders.css";

// Generate a unique 4-digit PIN
const generateUniquePin = (existingOrders) => {
  let pin;
  do {
    pin = Math.floor(1000 + Math.random() * 9000); // Random 4-digit
  } while (existingOrders.some((order) => order.pin === pin));
  return pin;
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const [latestPin, setLatestPin] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Load saved orders
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders([...savedOrders].reverse());

    // Check for PayFast success
    const params = new URLSearchParams(location.search);
    if (params.get("paymentSuccess") === "true") {
      const lastOrder = savedOrders[savedOrders.length - 1];

      if (lastOrder && !lastOrder.pin) {
        // ✅ Generate a unique 4-digit PIN
        const pin = generateUniquePin(savedOrders);
        lastOrder.pin = pin;
        lastOrder.completed = false;

        // Save the updated orders list
        savedOrders[savedOrders.length - 1] = lastOrder;
        localStorage.setItem("orders", JSON.stringify(savedOrders));

        setLatestPin(pin);
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 5000);
      }
    }
  }, [location]);

  return (
    <div className="orders-container">
      {showBanner && latestPin && (
        <div className="success-banner">
          Payment Successful! <br />
          <strong>Your pickup PIN: {latestPin}</strong>
        </div>
      )}

      <h2>ORDERS</h2>

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
                      <strong>R{(item.price * item.quantity).toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>

                <p className="total">
                  TOTAL: <span>R{order.total.toFixed(2)}</span>
                </p>

                <p className="pickup-pin">
                  <strong>PIN:</strong> {order.pin || "—"}
                </p>

                <p
                  className={
                    order.completed ? "status-complete" : "status-pending"
                  }
                >
                  {order.completed ? "Completed" : "Pending"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
