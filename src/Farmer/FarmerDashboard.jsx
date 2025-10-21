import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Home from "../assets/Logo-noName.png";
import "./Farmer-Styles/FarmerDashboard.css";

export default function FarmerDashboard() {
    const { farmName } = useParams();
    const [farmerData, setFarmerData] = useState(null);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [sales, setSales] = useState(0);
    const [profit, setProfit] = useState(0);
    const [products, setProducts] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch farmer data and stats
    const fetchFarmerData = async () => {
        try {
            setLoading(true);
            
            // Get the active farmer from localStorage
            const activeFarmer = JSON.parse(localStorage.getItem("activeFarmer"));
            const storedFarmName = localStorage.getItem("farmName");

            // Security check - ensure farmer can only access their own dashboard
            if (!activeFarmer || !storedFarmName || storedFarmName !== farmName) {
                alert("Unauthorized access. Please login again.");
                handleLogout();
                return;
            }

            setFarmerData(activeFarmer);

            // Update stats from localStorage and backend
            updateStats();

        } catch (error) {
            console.error("Error fetching farmer data:", error);
            updateStats();
        } finally {
            setLoading(false);
        }
    };

    // Function to update stats from localStorage and backend
    const updateStats = () => {
        const storedFarmName = localStorage.getItem("farmName");
        if (!storedFarmName || storedFarmName !== farmName) {
            setCompletedOrders(0);
            setPendingOrders(0);
            setSales(0);
            setProfit(0);
            setProducts(0);
            return;
        }

        // Get orders and products from localStorage
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];

        // Calculate order statistics
        const farmerOrders = savedOrders.filter(order =>
            order.items?.some(item => item.farmer === storedFarmName)
        );

        let completed = 0;
        let pending = 0;
        let totalSales = 0;
        let totalProfit = 0;

        farmerOrders.forEach(order => {
            const farmerItems = order.items.filter(item => item.farmer === storedFarmName);
            const orderTotal = farmerItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            if (order.completed) {
                completed++;
                totalSales += orderTotal;
                totalProfit += orderTotal * 0.9; // 10% fee
            } else {
                pending++;
            }
        });

        // Get products count from localStorage
        const farmerProducts = savedProducts.filter(p => p.farmer === storedFarmName);

        setCompletedOrders(completed);
        setPendingOrders(pending);
        setSales(totalSales);
        setProfit(totalProfit);
        setProducts(farmerProducts.length);
    };

    // Fetch products count from backend
    const fetchProductsFromBackend = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/farmer/${farmName}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.products) {
                    setProducts(data.products.length);
                }
            }
        } catch (error) {
            console.error("Error fetching products from backend:", error);
            // Fallback to localStorage data already set in updateStats()
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("activeFarmer");
        localStorage.removeItem("farmName");
        navigate("/");
    };

    useEffect(() => {
        fetchFarmerData();
    }, [farmName]);

    // Real-time updates setup
    useEffect(() => {
        // Listen for product updates
        const handleProductUpdate = () => {
            console.log("Dashboard: Product update received - updating stats");
            updateStats();
            fetchProductsFromBackend();
        };

        // Listen for order updates
        const handleOrderUpdate = () => {
            console.log("Dashboard: Order update received - updating stats");
            updateStats();
        };

        // Listen for storage changes (from other tabs/windows)
        const handleStorageChange = (e) => {
            if (e.key === "orders" || e.key === "products") {
                console.log("Dashboard: Storage change detected - updating stats");
                updateStats();
                
                if (e.key === "products") {
                    fetchProductsFromBackend();
                }
            }
        };

        // Set up periodic refresh (every 30 seconds)
        const interval = setInterval(() => {
            console.log("Dashboard: Periodic refresh - updating stats");
            updateStats();
            fetchProductsFromBackend();
        }, 30000);

        // Add event listeners
        window.addEventListener("productUpdated", handleProductUpdate);
        window.addEventListener("orderUpdated", handleOrderUpdate);
        window.addEventListener("storage", handleStorageChange);

        // Cleanup function
        return () => {
            window.removeEventListener("productUpdated", handleProductUpdate);
            window.removeEventListener("orderUpdated", handleOrderUpdate);
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, [farmName]);

    if (loading) {
        return (
            <div className="farmer-main-page">
                <div className="loading-container">
                    <h2>Loading your dashboard...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="farmer-main-page">
            <h1 className="farmer-title">{farmName} DASHBOARD</h1>

            <div className="farmer-dashboard-container">
                {/* Business Overview Section */}
                <div className="farmer-stats-card">
                    <div className="stats-header">
                        <h3>BUSINESS OVERVIEW</h3>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-box completed">
                            <span className="stat-label">Completed Orders</span>
                            <span className="stat-value">{completedOrders}</span>
                        </div>
                        <div className="stat-box pending">
                            <span className="stat-label">Pending Orders</span>
                            <span className="stat-value">{pendingOrders}</span>
                        </div>
                        <div className="stat-box sales">
                            <span className="stat-label">Total Sales</span>
                            <span className="stat-value">R{sales.toFixed(2)}</span>
                        </div>
                        <div className="stat-box profit">
                            <span className="stat-label">Net Profit</span>
                            <span className="stat-value">R{profit.toFixed(2)}</span>
                        </div>
                        <div className="stat-box products">
                            <span className="stat-label">Products</span>
                            <span className="stat-value">{products}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <NavLink to="/" onClick={handleLogout}>
                <img src={Home} alt="Logout" className="LogOut" />
            </NavLink>
        </div>
    );
}