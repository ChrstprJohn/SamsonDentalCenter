import { Router } from 'express';
import * as ApprovalController from '../controllers/appointment-admin.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdminOrSecretary } from '../middleware/admin.middleware.js';
import { validate } from '../utils/validate.js';
import { approveAppointmentSchema, rejectAppointmentSchema } from '../schemas/appointment-admin.schema.js';

const router = Router();

// Secure all endpoints: Auth + Role check
router.use(requireAuth, requireAdminOrSecretary);

/**
 * @route   GET /api/v1/admin/appointments-approval/:id/detail
 * @desc    Fetch aggregated context for an approval request
 */
router.get('/:id/detail', ApprovalController.getApprovalDetail);

/**
 * @route   PATCH /api/v1/admin/appointments-approval/:id/approve
 * @desc    Approve a specialized request
 */
router.patch('/:id/approve', validate(approveAppointmentSchema), ApprovalController.approveRequest);

/**
 * @route   PATCH /api/v1/admin/appointments-approval/:id/reject
 * @desc    Reject a specialized request
 */
router.patch('/:id/reject', validate(rejectAppointmentSchema), ApprovalController.rejectRequest);

/**
 * @route   PATCH /api/v1/admin/appointments-approval/:id/start
 * @desc    Mark an appointment as IN_PROGRESS
 */
router.patch('/:id/start', ApprovalController.startAppointment);

export default router;

