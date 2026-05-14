import { Router } from 'express';
import * as invoiceController from '../controllers/invoice.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdminOrSecretary, requireStaff } from '../middleware/admin.middleware.js';

import { validate } from '../utils/validate.js';
import { createInvoiceSchema } from '../schemas/invoice.schema.js';

const router = Router();

// All invoice routes require authentication
router.use(requireAuth);

/**
 * @route POST /api/v1/invoices
 * @desc Create a new invoice (Dentist or Staff)
 */
router.post('/', requireStaff, validate(createInvoiceSchema), invoiceController.createInvoice);


/**
 * @route GET /api/v1/invoices/appointment/:appointmentId
 * @desc Get invoice for a specific appointment
 */
router.get('/appointment/:appointmentId', invoiceController.getInvoiceByAppointment);

/**
 * @route GET /api/v1/invoices/patient/:patientId
 * @desc Get all invoices for a patient (Staff only)
 */
router.get('/patient/:patientId', requireAdminOrSecretary, invoiceController.getPatientInvoices);

export default router;
