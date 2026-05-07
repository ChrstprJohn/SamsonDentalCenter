import * as ApprovalService from '../services/appointment-admin.service.js';

/**
 * GET /api/v1/admin/appointments-approval/:id/detail
 */
export const getApprovalDetail = async (req, res, next) => {
    try {
        const detail = await ApprovalService.getAggregatedApprovalDetails(req.params.id);
        res.json(detail);
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/v1/admin/appointments-approval/:id/approve
 */
export const approveRequest = async (req, res, next) => {
    try {
        const { dentist_id, note } = req.body;
        const appointment = await ApprovalService.approveAppointment(
            req.params.id,
            req.user.id,
            dentist_id,
            note
        );
        res.json({
            message: 'Appointment request approved successfully.',
            appointment
        });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/v1/admin/appointments-approval/:id/reject
 */
export const rejectRequest = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const appointment = await ApprovalService.rejectAppointment(
            req.params.id,
            req.user.id,
            reason
        );
        res.json({
            message: 'Appointment request rejected.',
            appointment
        });
    } catch (err) {
        next(err);
    }
};
