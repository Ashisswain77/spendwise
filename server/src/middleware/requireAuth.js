import { getAuth } from "@clerk/express";

export function requireAuth(req, res, next) {
    // In isolated test environment only: allow test suite to simulate verified identity
    // SECURITY: This bypass is strictly disabled in production (NODE_ENV !== "test")
    if (process.env.NODE_ENV === "test" && req.headers["x-test-user-id"]) {
        req.userId = req.headers["x-test-user-id"];
        return next();
    }

    try {
        const { isAuthenticated, userId } = getAuth(req);

        if (!isAuthenticated || !userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        req.userId = userId;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }
}
