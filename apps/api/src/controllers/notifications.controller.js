import {
    getUserNotifications,
    toggleRead,
    markAllAsRead,
    getUnreadCount,
    toggleStar,
    toggleArchive,
    getNotificationStats,
} from '../services/notification.service.js';

/**
 * GET /api/notifications/my
 * Optional query: ?unread=true&archived=false&page=1&limit=10
 */
export const getMyNotifications = async (req, res, next) => {
    try {
        const unreadOnly = req.query.unread === 'true';
        const includeArchived = req.query.archived === 'true';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const [{ notifications, total }, stats] = await Promise.all([
            getUserNotifications(req.user.id, unreadOnly, includeArchived, page, limit),
            getNotificationStats(req.user.id),
        ]);

        res.json({
            notifications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            stats,
        });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * PATCH /api/notifications/:id/star
 * Body: { starred: boolean }
 */
export const star = async (req, res, next) => {
    try {
        const result = await toggleStar(req.params.id, req.user.id, req.body.starred);
        res.json({ message: 'Starred status updated.', notification: result });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * PATCH /api/notifications/:id/archive
 * Body: { archived: boolean }
 */
export const archive = async (req, res, next) => {
    try {
        const result = await toggleArchive(req.params.id, req.user.id, req.body.archived);
        res.json({ message: 'Archive status updated.', notification: result });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * GET /api/notifications/unread-count
 * Used by the frontend notification bell badge.
 */
export const unreadCount = async (req, res, next) => {
    try {
        const result = await getUnreadCount(req.user.id);
        res.json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * PATCH /api/notifications/:id/read
 * Body: { read: boolean }
 */
export const markRead = async (req, res, next) => {
    try {
        const isRead = req.body.read !== false; // Default to true if not provided
        const notification = await toggleRead(req.params.id, req.user.id, isRead);
        res.json({ message: isRead ? 'Marked as read.' : 'Marked as unread.', notification });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * PATCH /api/notifications/read-all
 */
export const markAllRead = async (req, res, next) => {
    try {
        const result = await markAllAsRead(req.user.id);
        res.json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};
