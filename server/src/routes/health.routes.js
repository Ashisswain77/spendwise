import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/", (_req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;

    res.status(isDbConnected ? 200 : 503).json({
        success: isDbConnected,
        message: isDbConnected ? "SpendWise API is running" : "Database connection unavailable",
        timestamp: new Date().toISOString(),
        database: isDbConnected ? "connected" : "disconnected",
    });
});

router.get("/private", requireAuth, (req, res) => {
    res.json({
        success: true,
        message: "Authenticated successfully",
        userId: req.userId,
    });
});

export default router;