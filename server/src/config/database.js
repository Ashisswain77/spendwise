import mongoose from "mongoose";

export async function connectDatabase() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(uri, {
        dbName: process.env.DB_NAME || "spendwise",
        serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
}