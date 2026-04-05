import { Router } from 'express';
import {
    getAvailable,
    getSuggestions,
    getSuggestionsPublic,
    getAvailablePublic,
} from '../controllers/slots.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../utils/validate.js';
import { getAvailableSchema, getSuggestionsSchema } from '../schemas/slot.schema.js';

const router = Router();

// Public route
router.get('/available/public', validate(getAvailableSchema), getAvailablePublic);
router.get('/suggest/public', validate(getSuggestionsSchema), getSuggestionsPublic);

// Private route
router.get('/available', validate(getAvailableSchema), requireAuth, getAvailable);
router.get('/suggest', validate(getSuggestionsSchema), requireAuth, getSuggestions);

export default router;
