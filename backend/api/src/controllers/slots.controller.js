import { getAvailableSlots, getSuggestedSlots } from '../services/slot.service.js';
// ── FOR GUESTS (no auth) ──
export const getSuggestionsPublic = async (req, res, next) => {
    try {
        const { date, service_id, time } = req.query;

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
        const { date, service_id, session_id, dentist_id } = req.query;

        // Check date is not in the past
        const requestedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestedDate < today) {
            return res.status(400).json({ error: 'Cannot check availability for past dates.' });
        }

        const result = await getAvailableSlots(date, service_id, session_id, false, dentist_id);
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
        const { date, service_id, session_id, dentist_id } = req.query;

        // Check date is not in the past
        const requestedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestedDate < today) {
            return res.status(400).json({ error: 'Cannot check availability for past dates.' });
        }

        // ── Get available slots ──
        const result = await getAvailableSlots(date, service_id, session_id, false, dentist_id);

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

        const result = await getSuggestedSlots(date, service_id, time);

        res.json(result);
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};
