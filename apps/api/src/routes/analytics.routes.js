import { Router } from 'express';
import { dashboard, dentists, services, peakHours } from '../controllers/analytics.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdminOrSecretary } from '../middleware/admin.middleware.js';

const router = Router();

// All analytics routes require supervisor+ access
router.use(requireAuth, requireAdminOrSecretary);

router.get('/dashboard', dashboard);
router.get('/dentists', dentists);
router.get('/services', services);
router.get('/peak-hours', peakHours);

export default router;
