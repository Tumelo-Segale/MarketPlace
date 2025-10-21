import express from "express";
import { registerFarmer, checkFarmName } from "../controllers/farmerController.js";

const router = express.Router();

router.post("/register", registerFarmer);
router.post("/check", checkFarmName);

export default router;
