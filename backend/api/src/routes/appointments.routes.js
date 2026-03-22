import { Router } from 'express';
import {
    bookGuest,
    confirmEmail,
    resendConfirmation,
    bookUser,
    getMyAppointments,
    getOne,
    cancel,
    reschedule,
    guestCancelInfo,
    guestCancelConfirm,
    guestRescheduleInfo,
    guestRescheduleConfirm,
} from '../controllers/appointments.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// --- 1. Public/Optional Routes ---
// Allows guests to book
router.post('/book-guest', bookGuest); // Guest books → PENDING

router.get('/confirm-email', confirmEmail); // Guest clicks email link → CONFIRMED
router.post('/resend-confirmation', resendConfirmation); // Guest requests new email

// Add these public routes (no auth — token-based):
router.get('/guest/cancel', guestCancelInfo); // Show cancel confirmation page
router.post('/guest/cancel', guestCancelConfirm); // Guest confirms cancel
router.get('/guest/reschedule', guestRescheduleInfo); // Show slot picker page
router.post('/guest/reschedule', guestRescheduleConfirm); // Guest confirms reschedule

// --- 2. Protected Routes ---
// These strictly require a login to see personal data
router.post('/book-user', requireAuth, bookUser); // Patient books → CONFIRMED immediately

router.get('/my', requireAuth, getMyAppointments);
router.get('/:id', requireAuth, getOne);

router.patch('/:id/cancel', requireAuth, cancel);
router.patch('/:id/reschedule', requireAuth, reschedule);

export default router;
