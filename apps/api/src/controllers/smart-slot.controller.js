import {
    getEmergencyBuffer,
    analyzeNoShowRisk,
    suggestOptimalSlots,
} from '../services/smart-slot.service.js';

/**
 * GET /api/slots/emergency-buffer?date=X
 * Check the status of today's emergency buffer slot.
 * Supervisor only.
 */
export const emergencyBuffer = async (req, res, next) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const result = await getEmergencyBuffer(date);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/slots/analyze-risk
 * Analyze no-show risk for a potential booking.
 */
export const analyzeRisk = async (req, res, next) => {
    try {
        const { patient_id, date, time } = req.body;
        if (!patient_id || !date || !time) {
            return res.status(400).json({ error: 'patient_id, date, and time are required.' });
        }

        const result = await analyzeNoShowRisk(patient_id, date, time);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/slots/optimal?date=X&service_id=Y
 * Get optimal slot suggestions based on load balancing.
 * Helps patients choose times with better dentist availability.
 */
export const optimalSlots = async (req, res, next) => {
    try {
        const { date, service_id } = req.query;
        if (!date || !service_id) {
            return res.status(400).json({ error: 'date and service_id are required.' });
        }

        const suggestions = await suggestOptimalSlots(date, service_id);
        res.json({
            date,
            optimal_slots: suggestions,
            tip: 'Green slots have the best dentist availability. Choose one for faster appointments!',
        });
    } catch (err) {
        next(err);
    }
};
