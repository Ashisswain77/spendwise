export function errorHandler(err, req, res, _next) {
    if (err.message === "CORS_NOT_ALLOWED") {
        return res.status(403).json({
            success: false,
            message: "CORS error: Request origin is not allowed.",
        });
    }

    // Handle JSON parsing syntax error
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Malformed JSON payload provided.",
        });
    }

    // Handle MongoDB duplicate key error (code 11000)
    if (err.code === 11000) {
        const fields = Object.keys(err.keyPattern || {}).join(", ");
        return res.status(409).json({
            success: false,
            message: `Duplicate record conflict on: ${fields || "unique fields"}`,
        });
    }

    // Handle Mongoose CastError (e.g. invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid format for field '${err.path}'`,
        });
    }

    // Handle Mongoose ValidationError
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors || {}).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join("; ") || "Validation failed",
        });
    }

    const statusCode = err.statusCode || err.status || 500;
    const isProduction = process.env.NODE_ENV === "production";

    // Never leak stack traces or internal mongo internals to users
    res.status(statusCode).json({
        success: false,
        message: isProduction && statusCode === 500
            ? "Internal server error"
            : (err.message || "An unexpected error occurred"),
    });
}

