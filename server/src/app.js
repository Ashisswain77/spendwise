import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";

import healthRoutes from "./routes/health.routes.js";

const app = express();

// Trust reverse proxy (needed for accurate client IP in rate limiting behind proxies)
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Restrict CORS to trusted origins
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
]
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
            protectedExample: "/api/v1/health/private",
        },
        frontend: process.env.FRONTEND_URL || "http://localhost:5173",
    });
});

app.use("/api/v1/health", healthRoutes);

// 404 Route Not Found handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Centralized error handler
app.use((err, req, res, _next) => {
    if (err.message === "CORS_NOT_ALLOWED") {
        return res.status(403).json({
            success: false,
            message: "CORS error: Request origin is not allowed.",
        });
    }

    const statusCode = err.statusCode || err.status || 500;
    const isProduction = process.env.NODE_ENV === "production";

    res.status(statusCode).json({
        success: false,
        message: isProduction && statusCode === 500 
            ? "Internal server error" 
            : (err.message || "An unexpected error occurred"),
    });
});

export default app;