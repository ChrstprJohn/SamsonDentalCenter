export const validate = (schema) => (req, res, next) => {
    try {
        if (!schema || typeof schema.parse !== 'function') {
            throw new Error('Invalid schema passed to validate middleware');
        }

        const result = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        // Use Object.defineProperty to bypass "only a getter" errors
        // This keeps the controller logic simple (req.query, req.body etc stay updated)
        if (result.body !== undefined) {
            Object.defineProperty(req, 'body', { value: result.body, writable: true, configurable: true });
        }
        if (result.query !== undefined) {
            Object.defineProperty(req, 'query', { value: result.query, writable: true, configurable: true });
        }
        if (result.params !== undefined) {
            Object.defineProperty(req, 'params', { value: result.params, writable: true, configurable: true });
        }

        req.validated = result;
        next();
    } catch (err) {
        if (err.errors) {
            console.error('❌ Validation failed:', JSON.stringify(err.errors, null, 2));
        } else {
            console.error('❌ Validation middleware error:', err);
        }

        return res.status(400).json({
            error: 'Validation failed',
            details: err.errors ? err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })) : [{ message: err.message }],
        });
    }
};
