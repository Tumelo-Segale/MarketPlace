import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import MarketPlaceLogo from "../assets/Logo-noName.png";
import "./MarketPlace-Styles/MarketPlace.css";

export default function MarketPlace() {
  const [filter, setFilter] = useState("all");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
      setProducts(savedProducts);
    };

    loadProducts();
    window.addEventListener("storage", loadProducts);
    return () => window.removeEventListener("storage", loadProducts);
  }, []);

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === filter.toLowerCase()
        );

  const handleAddToCart = (product) => {
    if (cart.length > 0) {
      const existingFarmer = cart[0].farmer;
      if (product.farmer !== existingFarmer) {
        alert(
          `You can only order from one farmer per transaction.\nCurrent farmer: ${existingFarmer}`
        );
        return;
      }
    }

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = totalItems > 0 ? 3 : 0;
  const grandTotal = totalPrice + serviceFee;

  const handleCheckout = () => {
    navigate("/Checkout", {
      state: { cart, totalPrice, serviceFee, grandTotal },
    });
  };

  return (
    <>
      <div className="market-title">
        <NavLink to="/">
          <img src={MarketPlaceLogo} alt="Logo" />
        </NavLink>
        <h1>MARKET</h1>
      </div>

      <div className="filters">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
          ALL
        </button>
        <button className={filter === "fruit" ? "active" : ""} onClick={() => setFilter("fruit")}>
          FRUITS
        </button>
        <button className={filter === "vegetable" ? "active" : ""} onClick={() => setFilter("vegetable")}>
          VEGGIES
        </button>
      </div>

      <div className="product-list">
        {filteredProducts.length === 0 ? (
          <p className="no-products">No products available yet.</p>
        ) : (
          filteredProducts.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="product-details">
                <h3>{item.name}</h3>
                <p>R{item.price}</p>
                <p className="FarmerName">{item.farmer}</p>
                <button className="add-to-cart" onClick={() => handleAddToCart(item)}>
                  ADD TO CART
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalItems > 0 && (
        <button className="cart-button" onClick={() => setShowCart(true)}>
          {totalItems}
        </button>
      )}

      {showCart && (
        <div className="cart-popup">
          <div className="cart-header">
            <h3>CART ({totalItems})</h3>
            <button className="close-cart" onClick={() => setShowCart(false)}>×</button>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item no-img">
                <div className="cart-details">
                  <h4>{item.name}</h4>
                  <p>R{item.price} × {item.quantity}</p>
                </div>
                <div className="cart-controls">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <p className="SubTotal">Subtotal: R{totalPrice}</p>
            <p className="Servicefee">Service Fee: R{serviceFee}</p>
            <p className="GrandTotal"><strong>Total: R{grandTotal}</strong></p>

            <div className="cart-footer-buttons">
              <button className="checkout-btn" onClick={handleCheckout}>CHECKOUT</button>
              <button className="close-btn" onClick={() => setShowCart(false)}>CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
