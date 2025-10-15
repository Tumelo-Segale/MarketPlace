import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import AdminLogin from './Admin/AdminLogin';
import FarmerAddProducts from './Farmer/FarmerAddProducts';
import FarmerOrders from './Farmer/FarmerOrders';
import FarmerProducts from './Farmer/FarmerProducts';

import AdminDashboard from './Admin/AdminDashboard';
import AdminNavbar from './components/AdminNavbar';
import AdminOrders from './Admin/AdminOrders';
import AdminFarmers from './Admin/AdminFarmers';

//Layouts with navbar only
function MarketPlaceLayout({children}){
  return(
    <>
      <MarketPlaceNavbar/>
      <div className="page-content">{children}</div>
    </>
  )
}

//Layouts with navbar only
function FarmerLayout({children}){
  return(
    <>
      <FarmerNavbar/>
      <div className="page-content">{children}</div>
    </>
  )
}

//Layouts with navbar only
function AdminLayout({children}){
  return(
    <>
      <AdminNavbar/>
      <div className="page-content">{children}</div>
    </>
  )
}

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Pages without navbar */}
          <Route path="/" element={<LandingPage/>}/>

          {/* Pages with Logo */}
          <Route path="/AdminLogin" element={<AdminLogin/>}/>
          <Route path="/FarmerRegistration" element={<FarmerRegistration/>}/>
          <Route path="/FarmerLogin" element={<FarmerLogin/>}/>

          {/* MarketPlace Main Page with navbar*/}
          <Route path='/MarketPlace' element={
            <>
              <MarketPlace/>
              <MarketPlaceNavbar/>
            </>
          }/>

          {/* FarmerDashboard with navbar */}
          <Route path='/FarmerDashboard' element={
            <>
              <FarmerDashboard/>
              <FarmerNavbar/>
            </>
          }/>

          {/* AdminDashboard with navbar */}
          <Route path='/AdminDashboard' element={
            <>
              <AdminDashboard/>
              <AdminNavbar/>
            </>
          }/>

          {/* MarketPlace SubPages with navbar */}
          <Route path="/Orders" element={<MarketPlaceLayout> <Orders/> </MarketPlaceLayout>}/>
          <Route path="/Help" element={<MarketPlaceLayout> <Help/> </MarketPlaceLayout>}/>

          {/* MarketPlace Pages without navbar */}
          <Route path="/Checkout" element={<Checkout/>}/>

          {/* Farmer SubPages with navbar */}
          <Route path="/FarmerProfile" element={<FarmerLayout> <FarmerProfile/> </FarmerLayout>}/>
          <Route path="/FarmerAddProducts" element={<FarmerLayout> <FarmerAddProducts/> </FarmerLayout>}/>
          <Route path="/FarmerProducts" element={<FarmerLayout> <FarmerProducts/> </FarmerLayout>}/>
          <Route path="/FarmerOrders" element={<FarmerLayout> <FarmerOrders/> </FarmerLayout>}/>

          {/* Admin SubPages with navbar */}
          <Route path="/AdminOrders" element={<AdminLayout> <AdminOrders/> </AdminLayout>}/>
          <Route path="/AdminFarmers" element={<AdminLayout> <AdminFarmers/> </AdminLayout>}/>

        </Routes>
      </Router>
    </>
  )
}
