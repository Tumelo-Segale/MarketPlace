import React, { useEffect, useState } from "react";
import "./Farmer-Styles/FarmerProfile.css";

export default function FarmerProfile() {
    const [farmer, setFarmer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const activeFarmer = JSON.parse(localStorage.getItem("activeFarmer"));
        if (activeFarmer) setFarmer(activeFarmer);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFarmer((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Save updated info
            const allFarmers = JSON.parse(localStorage.getItem("farmers")) || [];
            const updatedFarmers = allFarmers.map((f) =>
                f.id === farmer.id ? farmer : f
            );
            localStorage.setItem("farmers", JSON.stringify(updatedFarmers));
            localStorage.setItem("activeFarmer", JSON.stringify(farmer));
            localStorage.setItem("farmName", farmer.farmName);

            alert("Profile updated successfully!");
        }
        setIsEditing(!isEditing);
    };

    const handleDelete = () => {
        if (
            window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            )
        ) {
            const allFarmers = JSON.parse(localStorage.getItem("farmers")) || [];
            const updatedFarmers = allFarmers.filter((f) => f.id !== farmer.id);
            localStorage.setItem("farmers", JSON.stringify(updatedFarmers));

            localStorage.removeItem("activeFarmer");
            localStorage.removeItem("farmName");

            alert("Account deleted successfully.");
            window.location.href = "/"; // redirect to homepage
        }
    };

    if (!farmer) {
        return <p style={{ textAlign: "center" }} className="no-farmer">No farmer profile found.</p>;
    }

    return (
        <div className="farmer-profile-container">
            <h1 className="profile-title">{farmer.farmName} PROFILE</h1>

            <div className="profile-card">
                <div className="profile-field">
                    <label>Full Name:</label>
                    {isEditing ? (
                        <input type="text" name="fullName" value={farmer.fullName} onChange={handleChange} />
                    ) : (
                        <p>{farmer.fullName}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Farm Name:</label>
                    {isEditing ? (
                        <input type="text" name="farmName" value={farmer.farmName} onChange={handleChange} />
                    ) : (
                        <p>{farmer.farmName}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Contact Number:</label>
                    {isEditing ? (
                        <input type="tel" name="contactNumber" value={farmer.contactNumber} onChange={handleChange} maxLength="10" />
                    ) : (
                        <p>{farmer.contactNumber}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Password:</label>
                    {isEditing ? (
                        <input type="password" name="password" value={farmer.password} onChange={handleChange} />
                    ) : (
                        <p>********</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Description:</label>
                    {isEditing ? (
                        <textarea name="description" value={farmer.description || ""} onChange={handleChange}></textarea>
                    ) : (
                        <p>{farmer.description || "(No description)"}</p>
                    )}
                </div>

                {/* Banking Details */}
                <div className="profile-field">
                    <label>Bank Name:</label>
                    {isEditing ? (
                        <input type="text" name="bankName" value={farmer.bankName || ""} onChange={handleChange} placeholder="e.g. Capitec Bank" />
                    ) : (
                        <p>{farmer.bankName || "(Not added)"}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Account Number:</label>
                    {isEditing ? (
                        <input type="text" name="accountNumber" value={farmer.accountNumber || ""} onChange={handleChange} placeholder="e.g. 1234567890" />
                    ) : (
                        <p>{farmer.accountNumber || "(Not added)"}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Branch Code:</label>
                    {isEditing ? (
                        <input type="text" name="branchCode" value={farmer.branchCode || ""} onChange={handleChange} placeholder="e.g. 123456" />
                    ) : (
                        <p>{farmer.branchCode || "(Not added)"}</p>
                    )}
                </div>

                <div className="profile-buttons">
                    <button className={isEditing ? "save-btn" : "edit-btn"} onClick={handleEditToggle}>
                        {isEditing ? "SAVE" : "EDIT PROFILE"}
                    </button>
                    <button className="profile-delete-btn" onClick={handleDelete}>
                        DELETE PROFILE
                    </button>
                </div>
            </div>
        </div>
    );
}
