const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(bodyParser.json());

// Simple base64 encoding for consistency
function simpleEncrypt(text) {
  return Buffer.from(text).toString('base64');
}

function simpleDecrypt(encodedText) {
  return Buffer.from(encodedText, 'base64').toString('utf8');
}

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "CropCartDB"
});

// Function to setup admin account
const setupAdmin = async () => {
  try {
    console.log('🔧 Setting up admin account...');
    
    // Check if admin account already exists
    db.query("SELECT * FROM admin WHERE id = 1", async (err, results) => {
      if (err) {
        console.error("Error checking admin account:", err);
        return;
      }
      
      if (results.length > 0) {
        console.log('Admin account already exists');
        return;
      }
      
      // Admin account doesn't exist, create it
      try {
        const encryptedContact = simpleEncrypt('0000000000');
        const hashedPassword = await bcrypt.hash('000000', 10);
        
        const sql = `
          INSERT INTO admin (id, contact_number, password_hash, role) 
          VALUES (1, ?, ?, 'admin')
        `;
        
        db.query(sql, [encryptedContact, hashedPassword], (err, result) => {
          if (err) {
            console.error("Admin setup database error:", err);
          } else {
            console.log("Admin account setup successful");
            console.log("Admin credentials:");
            console.log("Contact: 0000000000");
            console.log("Password: 000000");
          }
        });
      } catch (error) {
        console.error("Admin setup error:", error);
      }
    });
    
  } catch (error) {
    console.error('Admin setup failed:', error.message);
  }
};

db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    console.log("Connected to CropCartDB");
    
    // Create admin table if it doesn't exist
    const createAdminTable = `
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contact_number VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    db.query(createAdminTable, (err) => {
      if (err) {
        console.error("Error creating admin table:", err);
      } else {
        console.log("Admin table checked/created");
        // Setup admin account after table is created
        setupAdmin();
      }
    });
  }
});

// ==================== ROUTES ====================

// Test route
app.get("/api/test", (req, res) => {
  console.log("GET /api/test");
  res.json({ message: "Backend is working!" });
});

// ==================== UNIFIED LOGIN ROUTE - WITH DEBUG LOGS ====================

app.post("/api/login", async (req, res) => {
    console.log("=== LOGIN REQUEST ===");
    console.log("POST /api/login - Full body:", JSON.stringify(req.body));
    console.log("Contact number:", req.body.contactNumber);
    console.log("Password length:", req.body.password ? req.body.password.length : "undefined");
    
    const { contactNumber, password } = req.body;
  
    // Input validation
    if (!contactNumber || !password) {
      console.log("Missing contact number or password");
      return res.status(400).json({ 
        success: false, 
        message: "Contact number and password are required" 
      });
    }
  
    if (!/^\d+$/.test(contactNumber)) {
      console.log("Invalid contact number format");
      return res.status(400).json({ 
        success: false, 
        message: "Contact number must contain only digits" 
      });
    }
  
    try {
      // Check admin credentials
      const ADMIN_CONTACT = '0000000000';
      const ADMIN_PASSWORD = '000000';
      
      console.log("Checking if contact matches admin:", contactNumber === ADMIN_CONTACT);
      
      // Admin login check
      if (contactNumber === ADMIN_CONTACT) {
        console.log("Admin contact matched, checking password...");
        if (password === ADMIN_PASSWORD) {
          console.log("Admin login successful");
          return res.json({ 
            success: true, 
            message: "Admin login successful",
            userType: "admin",
            redirectTo: "/admin-dashboard",
            user: {
              id: 1,
              role: "admin",
              contactNumber: contactNumber
            }
          });
        } else {
          console.log("Admin password incorrect");
          return res.json({ 
            success: false, 
            message: "Invalid credentials" 
          });
        }
      }
  
      // Farmer login check
      console.log("Not admin, checking farmer login for contact:", contactNumber);
      
      db.query("SELECT * FROM farmers WHERE contactNumber = ?", [contactNumber], async (err, farmerResults) => {
        if (err) {
          console.error("Farmer login database error:", err);
          return res.status(500).json({ 
            success: false, 
            error: "Database error" 
          });
        }
        
        console.log("Farmer query results count:", farmerResults.length);
        
        if (farmerResults.length === 0) {
          console.log("No farmer found with contact:", contactNumber);
          return res.json({ 
            success: false, 
            message: "Invalid credentials" 
          });
        }
  
        const farmer = farmerResults[0];
        console.log("Found farmer:", farmer.farmName);
        
        try {
          console.log("Comparing password...");
          const match = await bcrypt.compare(password, farmer.password);
          console.log("Password match result:", match);
          
          if (match) {
            console.log("Farmer login successful for:", farmer.farmName);
            const { password: _, ...farmerWithoutPassword } = farmer;
            
            return res.json({ 
              success: true, 
              message: "Farmer login successful",
              userType: "farmer",
              redirectTo: "/farmer-dashboard",
              user: farmerWithoutPassword
            });
          } else {
            console.log("Farmer password incorrect");
            return res.json({ 
              success: false, 
              message: "Invalid credentials" 
            });
          }
        } catch (bcryptErr) {
          console.error("Password comparison error:", bcryptErr);
          return res.status(500).json({ 
            success: false, 
            error: "Authentication error" 
          });
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Server error" 
      });
    }
  });

// ==================== ADMIN ROUTES ====================

// Admin setup route
app.post("/api/admin/setup", async (req, res) => {
  console.log("POST /api/admin/setup", req.body);
  const { contactNumber, password } = req.body;
  
  if (!contactNumber || !password) {
    return res.status(400).json({ success: false, error: "Contact number and password are required" });
  }
  
  if (!/^\d{10}$/.test(contactNumber)) {
    return res.status(400).json({ success: false, error: "Contact number must be 10 digits" });
  }
  
  if (!/^\d{6}$/.test(password)) {
    return res.status(400).json({ success: false, error: "Password must be 6 digits" });
  }

  try {
    const encryptedContact = simpleEncrypt(contactNumber);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const sql = `
      INSERT INTO admin (id, contact_number, password_hash, role) 
      VALUES (1, ?, ?, 'admin') 
      ON DUPLICATE KEY UPDATE 
      contact_number = VALUES(contact_number), 
      password_hash = VALUES(password_hash)
    `;
    
    db.query(sql, [encryptedContact, hashedPassword], (err, result) => {
      if (err) {
        console.error("Admin setup database error:", err);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      console.log("Admin account setup successful");
      res.json({ success: true, message: "Admin account setup successful" });
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Admin login route (standalone)
app.post("/api/admin/login", async (req, res) => {
  console.log("POST /api/admin/login", req.body);
  const { contactNumber, password } = req.body;

  if (!contactNumber || !password) {
    return res.status(400).json({ success: false, message: "Contact number and password are required" });
  }

  if (!/^\d{10}$/.test(contactNumber)) {
    return res.status(400).json({ success: false, message: "Contact number must be 10 digits" });
  }

  if (!/^\d{6}$/.test(password)) {
    return res.status(400).json({ success: false, message: "Password must be 6 digits" });
  }

  try {
    db.query("SELECT * FROM admin WHERE id = 1", async (err, results) => {
      if (err) {
        console.error("Admin login database error:", err);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      
      if (results.length === 0) {
        return res.json({ success: false, message: "Admin account not configured" });
      }

      const admin = results[0];
      
      try {
        const decryptedContact = simpleDecrypt(admin.contact_number);
        console.log("Decrypted contact:", decryptedContact);
        console.log("Expected contact:", contactNumber);
        
        if (contactNumber !== decryptedContact) {
          console.log("Contact mismatch:", contactNumber, "!=", decryptedContact);
          return res.json({ success: false, message: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password_hash);
        
        if (!passwordMatch) {
          console.log("Password mismatch");
          return res.json({ success: false, message: "Invalid credentials" });
        }

        console.log("Admin login successful");
        res.json({ 
          success: true, 
          message: "Admin login successful",
          userType: "admin",
          redirectTo: "/admin-dashboard"
        });
      } catch (decryptError) {
        console.error("Decryption error:", decryptError);
        return res.status(500).json({ success: false, error: "Authentication system error" });
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Admin check route
app.get("/api/admin/check", (req, res) => {
  console.log("GET /api/admin/check");
  db.query("SELECT id, role FROM admin WHERE id = 1", (err, results) => {
    if (err) {
      console.error("Admin check error:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.json({ exists: false });
    }
    
    res.json({ 
      exists: true, 
      admin: {
        id: results[0].id,
        role: results[0].role
      }
    });
  });
});

// Reset admin account route (for debugging)
app.post("/api/admin/reset", async (req, res) => {
  console.log("POST /api/admin/reset");
  
  try {
    const encryptedContact = simpleEncrypt('0000000000');
    const hashedPassword = await bcrypt.hash('000000', 10);
    
    const sql = `
      UPDATE admin 
      SET contact_number = ?, password_hash = ?
      WHERE id = 1
    `;
    
    db.query(sql, [encryptedContact, hashedPassword], (err, result) => {
      if (err) {
        console.error("Admin reset error:", err);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      
      console.log("Admin account reset successfully");
      res.json({ success: true, message: "Admin account reset successfully" });
    });
  } catch (error) {
    console.error("Admin reset error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ==================== FARMER ROUTES ====================

// Check if farm name exists
app.post("/api/farmers/check", (req, res) => {
  console.log("POST /api/farmers/check", req.body);
  const { farmName } = req.body;
  
  if (!farmName) {
    return res.status(400).json({ error: "Farm name is required" });
  }

  db.query("SELECT * FROM farmers WHERE farmName = ?", [farmName], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ exists: results.length > 0 });
  });
});

// Register new farmer
app.post("/api/farmers/register", async (req, res) => {
  console.log("POST /api/farmers/register", req.body);
  const { fullName, farmName, contactNumber, password, description } = req.body;

  if (!fullName || !farmName || !contactNumber || !password) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO farmers (fullName, farmName, contactNumber, password, description, createdAt) VALUES (?, ?, ?, ?, ?, NOW())",
      [fullName, farmName, contactNumber, hashedPassword, description],
      (err, result) => {
        if (err) {
          console.error("Registration error:", err);
          return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true });
      }
    );
  } catch (err) {
    console.error("Password hashing error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Farmer login (standalone)
app.post("/api/farmers/login", (req, res) => {
  console.log("POST /api/farmers/login", req.body);
  const { contactNumber, password } = req.body;

  db.query("SELECT * FROM farmers WHERE contactNumber = ?", [contactNumber], async (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    
    if (results.length === 0) {
      return res.json({ success: false, message: "Farmer not found" });
    }

    const farmer = results[0];
    
    try {
      const match = await bcrypt.compare(password, farmer.password);
      
      if (!match) {
        return res.json({ success: false, message: "Invalid password" });
      }

      const { password: _, ...farmerWithoutPassword } = farmer;
      res.json({ 
        success: true, 
        farmer: farmerWithoutPassword,
        userType: "farmer",
        redirectTo: "/farmer-dashboard"
      });
    } catch (bcryptErr) {
      console.error("Password comparison error:", bcryptErr);
      res.status(500).json({ success: false, error: "Authentication error" });
    }
  });
});

// ==================== PRODUCT ROUTES ====================

// Add new product
app.post("/api/products/add", async (req, res) => {
    console.log("POST /api/products/add", req.body);
    const { farmerName, productName, price, category, image } = req.body;
  
    if (!farmerName || !productName || !price || !category) {
      return res.status(400).json({ success: false, error: "Farmer name, product name, price, and category are required" });
    }
  
    if (price <= 0) {
      return res.status(400).json({ success: false, error: "Price must be greater than 0" });
    }
  
    try {
      const sql = `
        INSERT INTO products (farmerName, productName, price, category, image) 
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.query(
        sql,
        [farmerName, productName, parseFloat(price), category, image],
        (err, result) => {
          if (err) {
            console.error("Product add error:", err);
            return res.status(500).json({ success: false, error: "Database error: " + err.message });
          }
          
          console.log("Product added successfully, ID:", result.insertId);
          res.json({ 
            success: true, 
            message: "Product added successfully",
            productId: result.insertId
          });
        }
      );
    } catch (error) {
      console.error("Product add error:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });
  
  // Get all products for a specific farmer
  app.get("/api/products/farmer/:farmName", (req, res) => {
    const { farmName } = req.params;
    console.log("GET /api/products/farmer/", farmName);
  
    db.query(
      "SELECT id, farmerName, productName, price, category, image FROM products WHERE farmerName = ? ORDER BY id DESC",
      [farmName],
      (err, results) => {
        if (err) {
          console.error("Error fetching farmer products:", err);
          return res.status(500).json({ success: false, error: "Database error" });
        }
        
        res.json({ 
          success: true, 
          products: results 
        });
      }
    );
  });
  
  // Get all products (for marketplace)
  app.get("/api/products", (req, res) => {
    console.log("GET /api/products");
    
    const { category, farmer } = req.query;
    let sql = "SELECT id, farmerName, productName, price, category, image FROM products WHERE 1=1";
    const params = [];
  
    if (category && category !== 'All') {
      sql += " AND category = ?";
      params.push(category);
    }
  
    if (farmer) {
      sql += " AND farmerName = ?";
      params.push(farmer);
    }
  
    sql += " ORDER BY id DESC";
  
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      
      res.json({ 
        success: true, 
        products: results 
      });
    });
  });
  
  // Get single product by ID
  app.get("/api/products/:productId", (req, res) => {
    const { productId } = req.params;
    console.log("GET /api/products/", productId);
  
    db.query(
      "SELECT id, farmerName, productName, price, category, image FROM products WHERE id = ?",
      [productId],
      (err, results) => {
        if (err) {
          console.error("Error fetching product:", err);
          return res.status(500).json({ success: false, error: "Database error" });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ success: false, error: "Product not found" });
        }
        
        res.json({ 
          success: true, 
          product: results[0] 
        });
      }
    );
  });
  
  // Update product
  app.put("/api/products/:productId", (req, res) => {
    const { productId } = req.params;
    const { productName, price, category, image } = req.body;
    console.log("PUT /api/products/", productId, req.body);
  
    if (!productName || !price || !category) {
      return res.status(400).json({ success: false, error: "Product name, price, and category are required" });
    }
  
    if (price <= 0) {
      return res.status(400).json({ success: false, error: "Price must be greater than 0" });
    }
  
    const sql = `
      UPDATE products 
      SET productName = ?, price = ?, category = ?, image = ?
      WHERE id = ?
    `;
  
    db.query(
      sql,
      [productName, parseFloat(price), category, image, productId],
      (err, result) => {
        if (err) {
          console.error("Product update error:", err);
          return res.status(500).json({ success: false, error: "Database error" });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, error: "Product not found" });
        }
        
        console.log("Product updated successfully");
        res.json({ 
          success: true, 
          message: "Product updated successfully" 
        });
      }
    );
  });
  
  // Delete product
  app.delete("/api/products/:productId", (req, res) => {
    const { productId } = req.params;
    console.log("DELETE /api/products/", productId);
  
    db.query(
      "DELETE FROM products WHERE id = ?",
      [productId],
      (err, result) => {
        if (err) {
          console.error("Product delete error:", err);
          return res.status(500).json({ success: false, error: "Database error" });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, error: "Product not found" });
        }
        
        console.log("Product deleted successfully");
        res.json({ 
          success: true, 
          message: "Product deleted successfully" 
        });
      }
    );
  });

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Available routes:`);
  console.log(`POST /api/login (Unified login for admin/farmer)`);
  console.log(`GET  /api/test`);
  console.log(`POST /api/admin/setup`);
  console.log(`POST /api/admin/login`);
  console.log(`POST /api/admin/login-simple`);
  console.log(`POST /api/admin/reset`);
  console.log(`GET  /api/admin/check`);
  console.log(`POST /api/farmers/check`);
  console.log(`POST /api/farmers/register`);
  console.log(`POST /api/farmers/login`);
  console.log(`POST /api/products/add`);
  console.log(`GET  /api/products/farmer/:farmName`);
  console.log(`GET  /api/products`);
  console.log(`GET  /api/products/:productId`);
  console.log(`PUT  /api/products/:productId`);
  console.log(`DELETE /api/products/:productId`);
});

// For automatic setup
if (process.env.AUTO_SETUP_ADMIN) {
    setTimeout(() => {
      require('./setupAdmin.js')();
    }, 2000);
}