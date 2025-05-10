import express from "express";
import { getCustomerStats } from "../controllers/customer.controller";
import { protect, adminOnly } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/stats", protect, adminOnly, getCustomerStats);

export default router;
