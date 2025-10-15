import React, { useEffect, useState } from "react";
import "./Admin-Styles/AdminFarmers.css";

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  useEffect(() => {
    const savedFarmers = JSON.parse(localStorage.getItem("farmers")) || [];
    setFarmers(savedFarmers);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;

    const updatedFarmers = farmers.filter((f) => f.id !== id);
    setFarmers(updatedFarmers);
    localStorage.setItem("farmers", JSON.stringify(updatedFarmers));
    setSelectedFarmer(null);
  };

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total generated and profit for a farmer
  const calculateFarmerStats = (farmerName) => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const farmerOrders = savedOrders.filter(
      (order) => order.completed && order.items?.some(item => item.farmer === farmerName)
    );

    let totalGenerated = 0;
    let profit = 0;

    farmerOrders.forEach(order => {
      const farmerItems = order.items.filter(item => item.farmer === farmerName);
      const orderTotal = farmerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      totalGenerated += orderTotal;
      profit += orderTotal * 0.9; // 10% platform fee deducted
    });

    return { totalGenerated, profit };
  };

  const farmerStats = selectedFarmer ? calculateFarmerStats(selectedFarmer.farmName) : { totalGenerated: 0, profit: 0 };

  return (
    <div className="admin-farmers-container">
      <h2>FARMERS REGISTERED</h2>

      <input type="text" placeholder="Search by farm name..." className="search-bar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      {filteredFarmers.length === 0 ? (
        <p className="no-farmers">No farmers found.</p>
      ) : (
        <div className="farmers-list">
          {filteredFarmers.map((farmer) => (
            <div key={farmer.id} className="farmer-card" onClick={() => setSelectedFarmer(farmer)}>
              <h3>{farmer.farmName}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Popup */}
      {selectedFarmer && (
        <div className="farmer-popup-overlay">
          <div className="farmer-popup">
            <h3>{selectedFarmer.farmName}</h3>
            <p><strong>Owner:</strong> {selectedFarmer.fullName}</p>
            <p><strong>Contact:</strong> {selectedFarmer.contactNumber}</p>
            <p><strong>Description:</strong> {selectedFarmer.description || "(Not added)"}</p>
            <p><strong>Bank Name:</strong> {selectedFarmer.bankName || "(Not added)"}</p>
            <p><strong>Account Number:</strong> {selectedFarmer.accountNumber || "(Not added)"}</p>
            <p><strong>Branch Code:</strong> {selectedFarmer.branchCode || "(Not added)"}</p>
            <p><strong>Total Generated:</strong> R{farmerStats.totalGenerated.toFixed(2)}</p>
            <p><strong>Farmer Profit:</strong> R{farmerStats.profit.toFixed(2)}</p>

            <div className="popup-buttons">
              <button className="admin-delete-btn" onClick={() => handleDelete(selectedFarmer.id)}>
                DELETE
              </button>
              <button className="admin-close-btn" onClick={() => setSelectedFarmer(null)}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
