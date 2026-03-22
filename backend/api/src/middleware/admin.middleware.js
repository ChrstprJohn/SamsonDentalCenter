export const requireSupervisor = (req, res, next) => {
    // req.user is set by requireAuth middleware
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }

    const allowedRoles = ['admin', 'supervisor'];

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            error: 'Access denied. Supervisor role required.',
        });
    }

    next();
};

export const requireDentist = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }

    if (req.user.role !== 'dentist') {
        return res.status(403).json({ error: 'Access denied. Dentist role required.' });
    }

    next();
};

export const requireStaff = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }

    const staffRoles = ['admin', 'supervisor', 'dentist'];

    if (!staffRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied. Staff role required.' });
    }

    next();
};

/**
 * Middleware: Check if the logged-in user is an ADMIN (not supervisor).
 * Used for admin-only operations: user management, audit logs, system health.
 *
 * MUST be used AFTER requireAuth middleware.
 * Usage in routes: router.get('/admin-only', requireAuth, requireAdmin, controller)
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Access denied. Admin role required.',
        });
    }

    next();
};
