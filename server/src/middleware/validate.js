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
