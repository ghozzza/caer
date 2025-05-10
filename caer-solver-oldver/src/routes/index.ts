import express from "express";
import { borrow } from "../controllers/borrow.controller";
import { getPriceFeed } from "../controllers/pricefeed.controller";
const router = express.Router();

// Borrow routes
router.post("/api/borrow", borrow);

// Price feed routes
router.get("/send-target-reports", getPriceFeed);

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default router;
