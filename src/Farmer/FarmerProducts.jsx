import React, { useEffect, useState } from "react";
import "./Farmer-Styles/FarmerProducts.css";

export default function FarmerProducts() {
    const [products, setProducts] = useState([]);
    const [farmName, setFarmName] = useState("");

    useEffect(() => {
        const storedFarmName = localStorage.getItem("farmName");
        if (storedFarmName) setFarmName(storedFarmName);

        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
        const farmerProducts = savedProducts
            .filter((product) => product.farmer === storedFarmName)
            .sort((a, b) => b.id - a.id); // latest first
        setProducts(farmerProducts);
    }, []);

    useEffect(() => {
        // Listen for updates (when product is added)
        const handleStorageChange = () => {
            const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
            const farmerProducts = savedProducts
                .filter((product) => product.farmer === farmName)
                .sort((a, b) => b.id - a.id); // latest first
            setProducts(farmerProducts);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [farmName]);

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
        const updatedProducts = savedProducts.filter((product) => product.id !== id);

        localStorage.setItem("products", JSON.stringify(updatedProducts));

        const farmerProducts = updatedProducts
            .filter((product) => product.farmer === farmName)
            .sort((a, b) => b.id - a.id); // latest first
        setProducts(farmerProducts);

        window.dispatchEvent(new Event("storage"));
    };

    return (
        <div className="farmer-products-page">
            <h1 className="farmer-products-title">{farmName} PRODUCTS</h1>

            {products.length === 0 ? (
                <p className="farmer-no-products">No products added yet.</p>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="farmer-product-card">
                            <div className="farmer-image">
                                <img src={product.image} alt={product.name} className="farmer-product-image" />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-category">{product.category}</p>
                                <p className="product-price">R{product.price.toFixed(2)}</p>
                                <button className="product-delete-btn" onClick={() => handleDelete(product.id)}>
                                    REMOVE PRODUCT
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
