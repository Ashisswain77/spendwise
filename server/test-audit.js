import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";
import mongoose from "mongoose";

async function runAuditTests() {
    console.log("=== STARTING SPENDWISE AUDIT TEST SUITE ===\n");
    let passed = 0;
    let failed = 0;

    function assert(condition, testName, details = "") {
        if (condition) {
            console.log(`[PASS] ${testName}`);
            passed++;
        } else {
            console.error(`[FAIL] ${testName} ${details ? "- " + details : ""}`);
            failed++;
        }
    }

    // 1. Connect database
    try {
        await connectDatabase();
        assert(mongoose.connection.readyState === 1, "Database: MongoDB connects securely");
    } catch (err) {
        assert(false, "Database: MongoDB connects securely", err.message);
    }

    // 2. Start temporary in-memory test server
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
        // Test 1: GET /api/v1/health
        const healthRes = await fetch(`${baseUrl}/api/v1/health`);
        const healthData = await healthRes.json();
        assert(healthRes.status === 200, "Health Check: Status is 200 OK");
        assert(healthData.success === true, "Health Check: success === true");
        assert(healthData.message === "SpendWise API is running", "Health Check: message confirms running");
        assert(healthData.database === "connected", "Health Check: database shows connected");

        // Test 2: Security Headers (Helmet)
        assert(
            healthRes.headers.get("x-content-type-options") === "nosniff",
            "Security Headers: X-Content-Type-Options: nosniff present"
        );
        assert(
            healthRes.headers.has("x-frame-options"),
            "Security Headers: X-Frame-Options present"
        );

        // Test 3: Rate Limiting Headers
        assert(
            healthRes.headers.has("ratelimit-limit"),
            "Rate Limiting: ratelimit-limit header present"
        );
        assert(
            healthRes.headers.has("ratelimit-remaining"),
            "Rate Limiting: ratelimit-remaining header present"
        );

        // Test 4: Private Endpoint rejects unauthenticated request
        const privateRes = await fetch(`${baseUrl}/api/v1/health/private`);
        const privateData = await privateRes.json();
        assert(privateRes.status === 401, "Protected Route: Status is 401 Unauthorized when unauthenticated");
        assert(privateData.success === false, "Protected Route: success === false");
        assert(privateData.message === "Authentication required", "Protected Route: message indicates authentication required");

        // Test 5: Route Not Found (404)
        const notFoundRes = await fetch(`${baseUrl}/api/v1/unknown-endpoint`);
        const notFoundData = await notFoundRes.json();
        assert(notFoundRes.status === 404, "404 Handler: Status is 404 for unknown route");
        assert(notFoundData.success === false, "404 Handler: success === false JSON returned");

        // Test 6: CORS - Allowed Origin
        const allowedCorsRes = await fetch(`${baseUrl}/api/v1/health`, {
            headers: { Origin: "http://localhost:5173" },
        });
        assert(
            allowedCorsRes.headers.get("access-control-allow-origin") === "http://localhost:5173",
            "CORS: Allowed origin http://localhost:5173 accepted"
        );
        assert(
            allowedCorsRes.headers.get("access-control-allow-credentials") === "true",
            "CORS: Credentials allowed for trusted origin"
        );

        // Test 7: CORS - Disallowed Origin
        const blockedCorsRes = await fetch(`${baseUrl}/api/v1/health`, {
            headers: { Origin: "http://evil-attacker.com" },
        });
        const blockedCorsData = await blockedCorsRes.json();
        assert(blockedCorsRes.status === 403, "CORS: Untrusted origin blocked with 403 Forbidden");
        assert(blockedCorsData.message.includes("CORS"), "CORS: Blocked origin error message returned");

        // Test 8: Payload Size Limit (20kb)
        const hugePayload = JSON.stringify({ data: "A".repeat(25 * 1024) });
        const payloadRes = await fetch(`${baseUrl}/api/v1/health`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: hugePayload,
        });
        assert(payloadRes.status === 413, "DoS Protection: Body payload over 20kb rejected with 413");

    } finally {
        server.close();
        await mongoose.connection.close();
    }

    console.log(`\n=== AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
    if (failed > 0) {
        process.exit(1);
    }
}

runAuditTests().catch((err) => {
    console.error("Test runner encountered error:", err);
    process.exit(1);
});
