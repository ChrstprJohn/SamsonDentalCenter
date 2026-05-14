import { z } from 'zod';

/**
 * Schema for creating a new invoice
 */
export const createInvoiceSchema = z.object({
    body: z.object({
        appointment_id: z.string().uuid(),
        patient_id: z.string().uuid(),
        dentist_id: z.string().uuid(),
        notes: z.string().optional(),
        items: z.array(z.object({
            service_id: z.string().uuid(),
            quantity: z.number().int().min(1).default(1)
        })).min(1, 'At least one service must be included in the invoice')
    })
});


/**
 * Schema for updating an invoice status (e.g., to 'paid')
 */
export const updateInvoiceStatusSchema = z.object({
    params: z.object({
        id: z.string().uuid()
    }),
    body: z.object({
        status: z.enum(['pending', 'paid', 'voided'])
    })
});
