import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Farmer-Styles/FarmerProducts.css";

export default function FarmerProducts() {
    const [products, setProducts] = useState([]);
    const [farmName, setFarmName] = useState("");

    // API instance
    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        timeout: 10000,
    });

    // Fetch products from backend
    const fetchProducts = async () => {
        if (!farmName) {
            console.log("No farm name available");
            return;
        }
        
        console.log("Fetching products for farm:", farmName);
        
        try {
            const response = await api.get(`/products/farmer/${farmName}`);
            console.log("Backend response:", response.data);
            
            if (response.data.success) {
                console.log("Products received:", response.data.products);
                setProducts(response.data.products);
            } else {
                console.error("Backend returned error:", response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            
            // Log detailed error information
            if (error.response) {
                console.error("Server response:", error.response.status, error.response.data);
            } else if (error.request) {
                console.error("No response received from server");
            }
            
            // Fallback to localStorage if backend fails
            const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
            const farmerProducts = savedProducts
                .filter((product) => product.farmer === farmName)
                .sort((a, b) => b.id - a.id);
            setProducts(farmerProducts);
        }
    };

    useEffect(() => {
        const storedFarmName = localStorage.getItem("farmName");
        console.log("Retrieved farmName from localStorage:", storedFarmName);
        
        if (storedFarmName) {
            setFarmName(storedFarmName);
        }
    }, []);

    // Fetch products when farmName changes
    useEffect(() => {
        if (farmName) {
            console.log("Farm name set, fetching products...");
            fetchProducts();
        }
    }, [farmName]);

    useEffect(() => {
        // Listen for custom product update event
        const handleProductUpdate = () => {
            console.log("Product update event received - refreshing products");
            fetchProducts();
        };

        // Listen for storage changes (from other tabs/windows)
        const handleStorageChange = (e) => {
            if (e.key === "products" || e.key === "farmName") {
                console.log("Storage change detected - refreshing products");
                fetchProducts();
            }
        };

        window.addEventListener("productUpdated", handleProductUpdate);
        window.addEventListener("storage", handleStorageChange);
        
        // Set up interval to periodically check for updates
        const interval = setInterval(() => {
            fetchProducts();
        }, 30000); // Refresh every 30 seconds
        
        return () => {
            window.removeEventListener("productUpdated", handleProductUpdate);
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, [farmName]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            console.log("Deleting product with ID:", id);
            const response = await api.delete(`/products/${id}`);
            
            if (response.data.success) {
                console.log("Product deleted successfully");
                // Update local state
                const updatedProducts = products.filter((product) => product.id !== id);
                setProducts(updatedProducts);
                
                // Also update localStorage for consistency
                const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
                const updatedLocalProducts = savedProducts.filter((product) => product.id !== id);
                localStorage.setItem("products", JSON.stringify(updatedLocalProducts));
                
                // Dispatch event to notify other components ✅ REAL-TIME UPDATE
                window.dispatchEvent(new Event("productUpdated"));
            }
        } catch (error) {
            console.error("Error deleting product from backend:", error);
            
            // Log detailed error
            if (error.response) {
                console.error("Delete error response:", error.response.status, error.response.data);
            }
            
            // Fallback to localStorage deletion
            const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
            const updatedProducts = savedProducts.filter((product) => product.id !== id);
            localStorage.setItem("products", JSON.stringify(updatedProducts));

            const farmerProducts = updatedProducts
                .filter((product) => product.farmer === farmName)
                .sort((a, b) => b.id - a.id);
            setProducts(farmerProducts);

            // Dispatch event to notify other components ✅ REAL-TIME UPDATE
            window.dispatchEvent(new Event("productUpdated"));
        }
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
                                <img 
                                    src={product.image} 
                                    alt={product.productName || product.name} 
                                    className="farmer-product-image" 
                                    onError={(e) => {
                                        e.target.src = '/default-image.jpg';
                                    }}
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.productName || product.name}</h3>
                                <p className="product-category">{product.category}</p>
                                <p className="product-price">R{parseFloat(product.price).toFixed(2)}</p>
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