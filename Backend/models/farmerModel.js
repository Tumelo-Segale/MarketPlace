import db from "../db.js";

export const createFarmer = (farmer, callback) => {
  const sql = `
    INSERT INTO farmers (fullName, farmName, contactNumber, password, description, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      farmer.fullName,
      farmer.farmName,
      farmer.contactNumber,
      farmer.password,
      farmer.description,
      new Date(),
    ],
    callback
  );
};

export const findFarmerByFarmName = (farmName, callback) => {
  db.query("SELECT * FROM farmers WHERE LOWER(farmName) = LOWER(?)", [farmName], callback);
};
