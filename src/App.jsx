import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';

import MarketPlace from './MarketPlace/MarketPlace';
import MarketPlaceNavbar from './components/MarketPlaceNavbar';
import Orders from './MarketPlace/Orders';
import Help from './MarketPlace/Help';
import Checkout from './MarketPlace/Checkout';

import FarmerRegistration from './Farmer/FarmerRegistration';
import FarmerLogin from './Farmer/FarmerLogin';
import FarmerDashboard from './Farmer/FarmerDashboard';
import FarmerNavbar from './components/FarmerNavbar';
import FarmerProfile from './Farmer/FarmerProfile';

import FarmerAddProducts from './Farmer/FarmerAddProducts';
import FarmerOrders from './Farmer/FarmerOrders';
import FarmerProducts from './Farmer/FarmerProducts';

import AdminDashboard from './Admin/AdminDashboard';
import AdminNavbar from './components/AdminNavbar';
import AdminOrders from './Admin/AdminOrders';
import AdminFarmers from './Admin/AdminFarmers';

// Protected Route Components
const ProtectedFarmerRoute = ({ children }) => {
  const activeFarmer = localStorage.getItem('activeFarmer');
  return activeFarmer ? children : <Navigate to="/FarmerLogin" />;
};

const ProtectedAdminRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
  return isAdminLoggedIn ? children : <Navigate to="/FarmerLogin" />;
};

// Layouts with navbar only
function MarketPlaceLayout({ children }) {
  return (
    <>
      <MarketPlaceNavbar />
      <div className="page-content">{children}</div>
    </>
  );
}

function FarmerLayout({ children }) {
  return (
    <>
      <FarmerNavbar />
      <div className="page-content">{children}</div>
    </>
  );
}

function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      <div className="page-content">{children}</div>
    </>
  );
}

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Pages without navbar */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Pages without navbar */}
          <Route path="/FarmerRegistration" element={<FarmerRegistration />} />
          <Route path="/FarmerLogin" element={<FarmerLogin />} />

          {/* MarketPlace Pages with navbar layout */}
          <Route path="/MarketPlace" element={
            <MarketPlaceLayout>
              <MarketPlace />
            </MarketPlaceLayout>
          } />
          
          <Route path="/Orders" element={
            <MarketPlaceLayout>
              <Orders />
            </MarketPlaceLayout>
          } />
          
          <Route path="/Help" element={
            <MarketPlaceLayout>
              <Help />
            </MarketPlaceLayout>
          } />

          {/* MarketPlace Pages without navbar */}
          <Route path="/Checkout" element={<Checkout />} />

          {/* Farmer Dashboard with navbar - PROTECTED ROUTE */}
          <Route path="/FarmerDashboard/:farmName" element={
            <ProtectedFarmerRoute>
              <FarmerLayout>
                <FarmerDashboard />
              </FarmerLayout>
            </ProtectedFarmerRoute>
          } />

          {/* Add this route alongside your existing dashboard route */}
          <Route path="/FarmerDashboard" element={
              <ProtectedFarmerRoute>
                  <FarmerLayout>
                      <FarmerDashboard />
                  </FarmerLayout>
              </ProtectedFarmerRoute>
          } />

          {/* Farmer SubPages with navbar - PROTECTED ROUTES */}
          <Route path="/FarmerProfile" element={
            <ProtectedFarmerRoute>
              <FarmerLayout>
                <FarmerProfile />
              </FarmerLayout>
            </ProtectedFarmerRoute>
          } />
          
          <Route path="/FarmerAddProducts" element={
            <ProtectedFarmerRoute>
              <FarmerLayout>
                <FarmerAddProducts />
              </FarmerLayout>
            </ProtectedFarmerRoute>
          } />
          
          <Route path="/FarmerProducts" element={
            <ProtectedFarmerRoute>
              <FarmerLayout>
                <FarmerProducts />
              </FarmerLayout>
            </ProtectedFarmerRoute>
          } />
          
          <Route path="/FarmerOrders" element={
            <ProtectedFarmerRoute>
              <FarmerLayout>
                <FarmerOrders />
              </FarmerLayout>
            </ProtectedFarmerRoute>
          } />

          {/* Farmer SubPages with dynamic farmName parameter */}
          <Route path="/FarmerAddProducts/:farmName" element={
            <ProtectedFarmerRoute>
              <FarmerLayout>
                <FarmerAddProducts />
              </FarmerLayout>
            </ProtectedFarmerRoute>
          } />
          
          <Route path="/FarmerOrders/:farmName" element={
            <ProtectedFarmerRoute>
              <FarmerLayout>
                <FarmerOrders />
              </FarmerLayout>
            </ProtectedFarmerRoute>
          } />
          
          <Route path="/FarmerProducts/:farmName" element={
            <ProtectedFarmerRoute>
              <FarmerLayout>
                <FarmerProducts />
              </FarmerLayout>
            </ProtectedFarmerRoute>
          } />

          {/* Admin Dashboard with navbar - PROTECTED ROUTE */}
          <Route path="/AdminDashboard" element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedAdminRoute>
          } />

          {/* Admin SubPages with navbar - PROTECTED ROUTES */}
          <Route path="/AdminOrders" element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </ProtectedAdminRoute>
          } />
          
          <Route path="/AdminFarmers" element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <AdminFarmers />
              </AdminLayout>
            </ProtectedAdminRoute>
          } />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}