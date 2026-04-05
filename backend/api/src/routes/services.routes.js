import { Router } from 'express';
import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getServiceSpecialists,
} from '../controllers/services.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();

// Public routes — anyone can view services
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.get('/:id/specialists', getServiceSpecialists);

// Admin-only routes (requires admin role, not just supervisor)
router.post('/', requireAuth, requireAdmin, createService);
router.patch('/:id', requireAuth, requireAdmin, updateService);
router.delete('/:id', requireAuth, requireAdmin, deleteService);

export default router;
