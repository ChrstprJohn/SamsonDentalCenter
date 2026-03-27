import { getAvailableSlots, getSuggestedSlots } from '../services/slot.service.js';
// ── FOR GUESTS (no auth) ──
export const getSuggestionsPublic = async (req, res, next) => {
    try {
        const { date, service_id, time } = req.query;

        const missingParams = [];
        if (!date) missingParams.push('date');
        if (!service_id) missingParams.push('service_id');
        if (!time) missingParams.push('time');

        if (missingParams.length > 0) {
            return res.status(400).json({
                error: `Missing required query parameter(s): ${missingParams.join(', ')}`,
                example: '/api/slots/suggest?date=2026-03-01&service_id=uuid&time=09:00',
            });
        }

        const result = await getSuggestedSlots(date, service_id, time);
        res.json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

// ── FOR GUESTS (no auth) ──
export const getAvailablePublic = async (req, res, next) => {
    try {
        const { date, service_id, session_id } = req.query;

        const missingParams = [];
        if (!date) missingParams.push('date');
        if (!service_id) missingParams.push('service_id');

        if (missingParams.length > 0) {
            return res.status(400).json({
                error: `Missing required query parameter(s): ${missingParams.join(', ')}`,
                example: '/api/slots/available?date=2026-03-01&service_id=uuid-here',
            });
        }

        // Check date is not in the past
        const requestedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestedDate < today) {
            return res.status(400).json({ error: 'Cannot check availability for past dates.' });
        }

        const result = await getAvailableSlots(date, service_id, session_id);
        res.json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * GET /api/slots/available?date=2026-03-01&service_id=xxx
 *
 * Get available time slots for a date and service.
 * Requires: Auth (patient must be logged in)
 */

export const getAvailable = async (req, res, next) => {
    try {
        const { date, service_id, session_id } = req.query;

        // ── Validate ──
        if (!date || !service_id) {
            return res.status(400).json({
                error: 'Both "date" and "service_id" query parameters are required.',
                example: '/api/slots/available?date=2026-03-01&service_id=uuid-here',
            });
        }

        // Check date is not in the past
        const requestedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestedDate < today) {
            return res.status(400).json({ error: 'Cannot check availability for past dates.' });
        }

        // ── Get available slots ──
        const result = await getAvailableSlots(date, service_id, session_id);

        res.json(result);
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};

/**
 * GET /api/slots/suggest?date=2026-03-01&service_id=xxx&time=09:00
 *
 * Get alternative slot suggestions when preferred time is unavailable.
 */
export const getSuggestions = async (req, res, next) => {
    try {
        const { date, service_id, time } = req.query;

        if (!date || !service_id || !time) {
            return res.status(400).json({
                error: 'date, service_id, and time are all required.',
                example: '/api/slots/suggest?date=2026-03-01&service_id=uuid&time=09:00',
            });
        }

        const result = await getSuggestedSlots(date, service_id, time);

        res.json(result);
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};
