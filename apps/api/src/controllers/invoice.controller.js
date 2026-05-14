import * as invoiceService from '../services/invoice.service.js';

/**
 * Create a new invoice
 */
export const createInvoice = async (req, res, next) => {
    try {
        const result = await invoiceService.createInvoice(req.body, req.user.id);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Get invoice by appointment ID
 */
export const getInvoiceByAppointment = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;
        const result = await invoiceService.getInvoiceByAppointment(appointmentId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Get invoices for a patient
 */
export const getPatientInvoices = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const result = await invoiceService.getPatientInvoices(patientId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};
