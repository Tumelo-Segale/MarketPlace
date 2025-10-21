import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // change if needed
  password: "", // your MySQL password
  database: "CropCartDB",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to CropCartDB");
});

export default db;
