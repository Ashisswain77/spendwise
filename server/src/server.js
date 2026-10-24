import "dotenv/config";
import mongoose from "mongoose";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDatabase();

        const server = app.listen(PORT, () => {
            console.log(`SpendWise API running on http://localhost:${PORT}`);
        });

        const shutdown = async (signal) => {
            console.log(`\nReceived ${signal}. Gracefully shutting down...`);
            server.close(async () => {
                await mongoose.connection.close();
                console.log("MongoDB connection closed.");
                process.exit(0);
            });
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));
    } catch (error) {
        console.error("Failed to start SpendWise:", error.message);
        process.exit(1);
    }
}

startServer();