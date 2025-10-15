# CropCart

**CropCart** is a digital platform that empowers small-scale farmers and local fruit and vegetable vendors by providing a digital marketplace to showcase their produce, track sales, and connect directly with customers. At the same time, it enables customers to browse, buy, and collect fresh produce from local farmers, supporting community agriculture and reducing dependency on middlemen.  

---

## Table of Contents

- [Features](#features)  
- [How It Works](#how-it-works)  
  - [Customer Flow](#customer-flow)  
  - [Farmer Flow](#farmer-flow)  
  - [Admin Flow](#admin-flow)  
- [Technologies Used](#technologies-used)  
- [Setup & Installation](#setup--installation)
---

## Features

### Customer
- Browse available products from local farmers  
- Add products to cart  
- Update, preview, and confirm orders  
- Checkout with PayFast payment integration  
- View order history  

### Farmer
- Register and create a personal farm profile  
- Dashboard with stats: completed orders, pending orders, total revenue, total profit, and total products  
- Add, update, and remove products  
- View and manage orders  
- Maintain farm and banking information  

### Admin
- Login with a 6-digit PIN  
- Dashboard showing total orders, farmers, products, revenue, and profit  
- Generate Batch EFT files for farmer payouts  
- View and manage all orders  
- View and manage all registered farmers  

---

## How It Works

### Customer Flow
1. Click **Browse Market** → redirected to the MarketPlace page.  
2. Browse available products.  
3. Add desired items to the cart.  
4. Preview, update, and confirm the order in the cart.  
5. Click **Checkout** → redirected to the Checkout page.  
6. Enter name, contact number, and optional message to the farmer.  
7. Press **Pay with PayFast** → redirected to PayFast portal to complete payment.  
8. Redirected to **Orders Page** to view order history.  

### Farmer Flow
1. Register using full name(s), farm name, contact number, password, and optional description.  
2. Redirected to **Dashboard** showing stats:  
   - Completed orders  
   - Pending orders  
   - Total revenue  
   - Profit made  
   - Total products listed  
3. Manage orders in **Orders Page**.  
4. Manage products in **Products Page**.  
5. Add new products in **Add Products Page**.  
6. Update personal and banking details in **FarmerProfile Page**.  

### Admin Flow
1. Login using preset 6-digit PIN.  
2. Redirected to **Dashboard** showing:  
   - Total orders completed  
   - Total farmers registered  
   - Total products on platform  
   - Total revenue generated  
   - Total profit made  
   - Generate Batch EFT file for payouts  
3. Manage and filter orders in **Orders Page**.  
4. Manage and filter registered farmers in **Farmers Page**.  

---

## Technologies Used
- **Frontend:** React.js, CSS  
- **Backend:** None for now
- **Database:** LocalStorage  
- **Payment Gateway:** PayFast Sandox to simulate payments 

---

## Setup & Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/Tumelo-Segale/cropcart.git
2. Navigate to the project directory:
   ```bash
     cd cropcart
4. Install dependencies:
   ```bash
     npm install
6. Start the development Server:
   ```bash
     npm run dev
