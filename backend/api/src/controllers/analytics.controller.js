import {
    getDashboardStats,
    getDentistPerformance,
    getPopularServices,
    getPeakHours,
} from '../services/analytics.service.js';

/**
 * GET /api/admin/analytics/dashboard
 * Query: ?start=2026-02-01&end=2026-02-28
 * Defaults to current month if no dates provided.
 */
export const dashboard = async (req, res, next) => {
    try {
        let { start, end } = req.query;

        // Default: current month
        if (!start || !end) {
            const now = new Date();
            start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
        }

        const stats = await getDashboardStats(start, end);
        res.json(stats);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * GET /api/admin/analytics/dentists
 */
export const dentists = async (req, res, next) => {
    try {
        let { start, end } = req.query;
        if (!start || !end) {
            const now = new Date();
            start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
        }

        const performance = await getDentistPerformance(start, end);
        res.json({ dentist_performance: performance });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/admin/analytics/services
 */
export const services = async (req, res, next) => {
    try {
        let { start, end } = req.query;
        if (!start || !end) {
            const now = new Date();
            start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
        }

        const popular = await getPopularServices(start, end);
        res.json({ popular_services: popular });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/admin/analytics/peak-hours
 */
export const peakHours = async (req, res, next) => {
    try {
        let { start, end } = req.query;
        if (!start || !end) {
            const now = new Date();
            start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
        }

        const peak = await getPeakHours(start, end);
        res.json({ peak_hours: peak });
    } catch (err) {
        next(err);
    }
};
