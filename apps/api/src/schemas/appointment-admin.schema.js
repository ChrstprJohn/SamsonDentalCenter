import { z } from 'zod';

/**
 * Schema for rejecting an appointment request.
 */
export const rejectAppointmentSchema = z.object({
    body: z.object({
        reason: z.string({
            required_error: 'Rejection reason is required.'
        })
        .min(5, 'Reason must be at least 5 characters.')
        .max(500, 'Reason cannot exceed 500 characters.')
        .trim(),
        suggested_date: z.string().optional()
    })
});

/**
 * Schema for approving an appointment request.
 */
export const approveAppointmentSchema = z.object({
    body: z.object({
        dentist_id: z.string().uuid().optional().nullable()
    })
});
