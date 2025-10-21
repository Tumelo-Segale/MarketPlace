import React, { useEffect, useState } from "react";
import "./Farmer-Styles/FarmerOrders.css";

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [farmName, setFarmName] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [enteredPin, setEnteredPin] = useState("");

  // Fetch orders function
  const fetchOrders = () => {
    const storedFarmName = localStorage.getItem("farmName");
    if (storedFarmName) setFarmName(storedFarmName);

    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const farmerOrders = savedOrders.filter((order) =>
      order.items?.some((item) => item.farmer === storedFarmName)
    );

    setOrders([...farmerOrders].reverse());
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Real-time updates setup
  useEffect(() => {
    // Listen for order updates
    const handleOrderUpdate = () => {
      console.log("FarmerOrders: Order update received - refreshing orders");
      fetchOrders();
    };

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "orders") {
        console.log("FarmerOrders: Storage change detected - refreshing orders");
        fetchOrders();
      }
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("orderUpdated", handleOrderUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const openPinModal = (orderId) => {
    setSelectedOrderId(orderId);
    setEnteredPin("");
    setShowPinModal(true);
  };

  const closePinModal = () => {
    setShowPinModal(false);
    setSelectedOrderId(null);
    setEnteredPin("");
  };

  const handleCompleteOrder = () => {
    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) return;

    if (enteredPin === String(order.pin)) {
      const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const updatedOrders = savedOrders.map((o) => {
        if (o.id === selectedOrderId) return { ...o, completed: true };
        return o;
      });

      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      setOrders(
        updatedOrders
          .filter((o) => o.items?.some((i) => i.farmer === farmName))
          .reverse()
      );
      
      // Dispatch orderUpdated event for real-time updates ✅
      window.dispatchEvent(new Event("orderUpdated"));
      
      closePinModal();
      alert("Order completed successfully!");
    } else {
      alert("Incorrect PIN. Please check with the customer.");
    }
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
                    onClick={() => openPinModal(order.id)}
                  >
                    COMPLETE ORDER
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <div className="pin-modal-overlay">
          <div className="pin-modal">
            <h3>Enter Customer PIN</h3>
            <input
              type="number"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="4-digit PIN"
            />
            <div className="modal-buttons">
              <button onClick={handleCompleteOrder}>Submit</button>
              <button onClick={closePinModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}