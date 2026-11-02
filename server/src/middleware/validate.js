import { z } from "zod";

/**
 * Text-only validator for descriptions (e.g. Dashboard transactions and Goals).
 * Rejects numbers and ensures only text characters are accepted.
 */
export const textOnlyDescriptionSchema = z
    .string({ required_error: "Description is required" })
    .trim()
    .min(1, "Description cannot be empty")
    .refine((val) => !/\d/.test(val), {
        message: "Description cannot contain numbers. Only text is allowed.",
    })
    .refine((val) => /[a-zA-Z]/.test(val), {
        message: "Description must contain valid text letters.",
    });

export const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!parsed.success) {
            const errors = parsed.error.issues.map((issue) => ({
                field: issue.path.length > 1 ? issue.path.slice(1).join(".") : issue.path.join("."),
                location: issue.path[0] || "body",
                message: issue.message,
            }));

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            });
        }

        if (parsed.data.body) req.body = parsed.data.body;
        if (parsed.data.query) req.query = parsed.data.query;
        if (parsed.data.params) req.params = parsed.data.params;

        next();
    } catch (err) {
        next(err);
    }
};
