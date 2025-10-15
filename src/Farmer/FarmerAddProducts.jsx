import React, { useState, useEffect } from "react";
import "./Farmer-Styles/FarmerAddProducts.css";

export default function FarmerAddProducts() {
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Vegetable");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [farmName, setFarmName] = useState("");

    useEffect(() => {
        const storedFarmName = localStorage.getItem("farmName");
        if (storedFarmName) setFarmName(storedFarmName);
    }, []);

    // Convert image to Base64 for storage
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result); // Base64 string
            setPreview(reader.result); // preview works
        };
        reader.readAsDataURL(file);
        }
    };

    const handleSaveProduct = (e) => {
        e.preventDefault();

        if (!productName || !price || !category || !image) {
        alert("Please fill in all fields and upload an image.");
        return;
        }

        const newProduct = {
        id: Date.now(),
        name: productName,
        price: parseFloat(price),
        category,
        image, // store Base64 string
        farmer: farmName,
        dateAdded: new Date().toISOString(),
        };

        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
        const updatedProducts = [...savedProducts, newProduct];
        localStorage.setItem("products", JSON.stringify(updatedProducts));

        alert(`Product "${productName}" added successfully!`);
        setProductName("");
        setPrice("");
        setCategory("Vegetable");
        setImage(null);
        setPreview(null);

        window.dispatchEvent(new Event("storage"));
    };

    return (
        <div className="add-product-page">
            <h1 className="add-product-title">ADD PRODUCT</h1>

            <form className="add-product-form" onSubmit={handleSaveProduct}>
                <div className="form-group">
                    <label>Product Name:</label>
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Tomatoes" required />
                </div>

                <div className="form-group">
                    <label>Price (R):</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 25" min="0" step="0.01" required />
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Vegetable">Vegetable</option>
                        <option value="Fruit">Fruit</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Upload Image:</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} required />
                </div>

                {preview && (
                <div className="image-preview">
                    <img src={preview} alt="Product Preview" />
                </div>
                )}

                <button type="submit" className="save-btn">
                    SAVE PRODUCT
                </button>
            </form>
        </div>
    );
}
