import { getAuth } from "@clerk/express";

export function requireAuth(req, res, next) {
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