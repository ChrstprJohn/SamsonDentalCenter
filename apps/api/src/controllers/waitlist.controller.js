import {
    joinWaitlist,
    getMyWaitlist,
    cancelWaitlistEntry,
    confirmWaitlistOffer,
    getWaitlistByToken,
    confirmWaitlistByToken,
    getWaitlistStats,
} from '../services/waitlist.service.js';
import { bookAppointment } from '../services/appointment.service.js';

/**
 * POST /api/waitlist/join
 * Body: { service_id, date, time?, priority? }
 */
export const join = async (req, res, next) => {
    try {
        const { service_id, date, time, priority, preferred_date, preferred_time } = req.body;

        // Support aliases for frontend compatibility
        const finalDate = date || preferred_date;
        const finalTime = time || preferred_time;

        if (!service_id || !finalDate) {
            return res.status(400).json({ error: 'service_id and date are required.' });
        }

        const result = await joinWaitlist(req.user.id, service_id, finalDate, finalTime, priority);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/waitlist/my
 */
export const getMine = async (req, res, next) => {
    try {
        const [entries, stats] = await Promise.all([
            getMyWaitlist(req.user.id),
            getWaitlistStats(req.user.id)
        ]);
        res.json({ waitlist: entries, total: entries.length, stats });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/waitlist/:id
 * Body: { remove_backup? } — if true, also cancel the linked backup appointment
 */
export const remove = async (req, res, next) => {
    try {
        const removeBackup = req.body?.remove_backup === true;
        const result = await cancelWaitlistEntry(req.params.id, req.user.id, removeBackup);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/waitlist/:id/confirm
 * Patient confirms they want the offered slot.
 *
 * Flow:
 * 1. confirmWaitlistOffer() validates, checks expiry, handles swap + cleanup
 * 2. If confirmed + we have a time → auto-book via bookAppointment()
 * 3. If no time → tell patient to pick a slot
 */
export const confirm = async (req, res, next) => {
    try {
        // 1. Confirm the waitlist offer (handles expiry cascade, swap, cleanup, and booking)
        const result = await confirmWaitlistOffer(req.params.id, req.user.id);

        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/waitlist/offer?token=xxx
 * Public: Fetch offer details using token.
 */
export const getPublicOffer = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ error: 'Token is required.' });

        const result = await getWaitlistByToken(token);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/waitlist/confirm?token=xxx
 * Public: Confirm offer using token.
 */
export const confirmPublicOffer = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ error: 'Token is required.' });

        // 1. Confirm the offer (the service now handles booking internally)
        const result = await confirmWaitlistByToken(token);

        res.json(result);
    } catch (err) {
        next(err);
    }
};
