import { Router } from 'express';
import { join, getMine, remove, confirm, getPublicOffer, confirmPublicOffer } from '../controllers/waitlist.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// --- Public Routes (Token-based) ---
router.get('/offer', getPublicOffer);
router.post('/confirm', confirmPublicOffer);

// --- Protected Routes (Require Login) ---
router.post('/join', requireAuth, join); // Join the waitlist
router.get('/my', requireAuth, getMine); // View my waitlist entries
router.delete('/:id', requireAuth, remove); // Cancel a waitlist entry
router.post('/:id/confirm', requireAuth, confirm); // Confirm a waitlist offer

export default router;
