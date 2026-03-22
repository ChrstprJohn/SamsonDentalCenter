export const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        // Attach parsed (and type-coerced) values
        req.validated = result;
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
