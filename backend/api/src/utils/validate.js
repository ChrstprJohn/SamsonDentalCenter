export const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        // Attach parsed (and type-coerced) values back to the request
        req.body = result.body;
        req.query = result.query;
        req.params = result.params;
        req.validated = result; // Keep this just in case
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Validation failed',
            details: err.errors?.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }
};
