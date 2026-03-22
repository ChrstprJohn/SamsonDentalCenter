import { Router } from 'express';
import {
    emergencyBuffer,
    analyzeRisk,
    optimalSlots,
} from '../controllers/smart-slot.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireSupervisor } from '../middleware/admin.middleware.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Public routes (all authenticated users)
router.get('/optimal', optimalSlots);
router.post('/analyze-risk', analyzeRisk);

// Supervisor+ access only
router.get('/emergency-buffer', requireSupervisor, emergencyBuffer);

export default router;
