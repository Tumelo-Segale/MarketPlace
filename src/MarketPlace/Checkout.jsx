import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MarketPlace-Styles/Checkout.css";

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();

    const { cart = [], totalPrice = 0, serviceFee = 0, grandTotal = 0 } = location.state || {};

    const [form, setForm] = useState({
        fullName: "",
        contact: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle PayFast payment
    const handlePayFast = (e) => {
        e.preventDefault();

        if (!form.fullName.trim() || !form.contact.trim()) {
        alert("Please fill in all required fields.");
        return;
        }

        if (!/^[0-9]{10}$/.test(form.contact)) {
        alert("Please enter a valid 10-digit contact number.");
        return;
        }

        setLoading(true);

        // Save order locally (for Orders page)
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const newOrder = {
        id: "ORD-" + Math.floor(Math.random() * 1000000),
        date: new Date().toISOString(),
        user: form,
        items: cart,
        total: grandTotal,
        };
        localStorage.setItem("orders", JSON.stringify([...existingOrders, newOrder]));

        // Create a summary of ordered items
        const itemSummary =
        cart.length <= 3
            ? cart.map((item) => `${item.name} ×${item.quantity}`).join(", ")
            : `${cart.length} items from CropCart`;

            const payfastData = {
                merchant_id: "10042465",
                merchant_key: "ylo9fatwu9xyj",
                return_url: "http://localhost:5173/Orders?paymentSuccess=true", // Include query string
                cancel_url: "http://localhost:5173/Checkout",
                notify_url: "http://localhost:5173/notify",
                name_first: form.fullName,
                email_address: "testbuyer@payfast.co.za",
                cell_number: form.contact,
                amount: grandTotal.toFixed(2),
                item_name: itemSummary,
            };              

        // Create hidden form for PayFast POST
        const formElement = document.createElement("form");
        formElement.method = "POST";
        formElement.action = "https://sandbox.payfast.co.za/eng/process";

        Object.entries(payfastData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        formElement.appendChild(input);
        });

        document.body.appendChild(formElement);
        formElement.submit(); // Redirect to PayFast
    };

    return (
        <div className="checkout-container">
        <h2>CHECKOUT</h2>

        <form method="POST" className="checkout-form" onSubmit={handlePayFast}>
            <div className="checkout-details">
            <label htmlFor="fullName">Full Name:</label>
            <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter Full Name"
                required
            />
            </div>

            <div className="checkout-details">
            <label htmlFor="contact">Contact Number:</label>
            <input
                type="tel"
                id="contact"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Enter 10-digit Contact Number"
                maxLength="10"
                required
            />
            </div>

            <div className="checkout-details">
            <label htmlFor="message">Message:</label>
            <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Any special instructions..."
            ></textarea>
            </div>

            <div className="order-details">
            <h3>ORDER SUMMARY</h3>
            <ul className="summary-list">
                {cart.map((item) => (
                <li key={item.id}>
                    <span className="item-name">
                    {item.name} × {item.quantity}
                    </span>
                    <span className="item-price">R{(item.price * item.quantity).toFixed(2)}</span>
                </li>
                ))}
            </ul>

            <div className="summary-total">
                <span>Subtotal:</span>
                <span>R{totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-total">
                <span>Service Fee:</span>
                <span>R{serviceFee.toFixed(2)}</span>
            </div>
            <div className="summary-total total-amount">
                <span>Total:</span>
                <span>R{grandTotal.toFixed(2)}</span>
            </div>
            </div>

            <button type="submit" className="payfast-btn" disabled={loading}>
            {loading ? "REDIRECTING..." : "PAY WITH PAYFAST"}
            </button>
        </form>
        </div>
    );
}
