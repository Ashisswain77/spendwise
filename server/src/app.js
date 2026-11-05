import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";

import healthRoutes from "./routes/health.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import goalRoutes from "./routes/goal.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Trust reverse proxy (needed for accurate client IP in rate limiting behind proxies)
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Restrict CORS to trusted origins
const defaultOrigins = process.env.NODE_ENV === "production" ? [] : ["http://localhost:5173"];
const envOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
    : [];
const allowedOrigins = [...new Set([...envOrigins, ...defaultOrigins])]
    .filter(Boolean)
    .map((url) => url.replace(/\/+$/, ""));

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
            if (!origin) return callback(null, true);

            const normalizedOrigin = origin.replace(/\/+$/, "");
            if (allowedOrigins.includes(normalizedOrigin)) {
                return callback(null, true);
            }
            callback(new Error("CORS_NOT_ALLOWED"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Payload size limit to prevent Denial of Service
app.use(express.json({ limit: "20kb" }));

// Clerk auth context middleware
app.use(clerkMiddleware());

// Rate limiting on all /api routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes.",
    },
});
app.use("/api", apiLimiter);

// Application routes
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "SpendWise API Server is running",
        version: "1.0.0",
        endpoints: {
            health: "/api/v1/health",
            transactions: "/api/v1/transactions",
            budgets: "/api/v1/budgets",
            goals: "/api/v1/goals",
        },
        frontend: process.env.FRONTEND_URL || "http://localhost:5173",
    });
});

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/budgets", budgetRoutes);
app.use("/api/v1/goals", goalRoutes);

// 404 Route Not Found handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Centralized error handler
    app.use(errorHandler);

export default app;
