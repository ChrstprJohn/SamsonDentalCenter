import { z } from 'zod';

const uuidSchema = z.string().uuid();
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format');

export const bookGuestSchema = z.object({
    body: z.object({
        service_id: uuidSchema,
        date: dateSchema,
        time: timeSchema,
        email: z.string().email(),
        phone: z.string().min(1),
        full_name: z.string().min(1),
        user_session_id: uuidSchema.optional(),
    }),
});

export const confirmEmailSchema = z.object({
    query: z.object({
        token: z.string().min(1),
    }),
});

export const resendConfirmationSchema = z.object({
    body: z.object({
        appointment_id: uuidSchema,
        email: z.string().email(),
    }),
});

export const bookUserSchema = z.object({
    body: z.object({
        service_id: uuidSchema,
        date: dateSchema,
        time: timeSchema,
        booked_for_name: z.string().optional().nullable(),
        user_session_id: uuidSchema.optional(),
        dentist_id: uuidSchema.optional(),
    }),
});

export const submitWizardSchema = z.object({
    body: z.object({
        service_id: uuidSchema,
        booking: z
            .object({
                date: dateSchema,
                time: timeSchema,
                booked_for_name: z.string().optional().nullable(),
                user_session_id: uuidSchema.optional(),
                dentist_id: uuidSchema.optional(),
            })
            .optional()
            .nullable(),
        waitlist: z
            .object({
                date: dateSchema.optional(),
                preferred_date: dateSchema.optional(),
                time: timeSchema.optional(),
                preferred_time: timeSchema.optional(),
                priority: z.number().optional(),
                booked_for_name: z.string().optional().nullable(),
            })
            .optional()
            .nullable(),
    }),
});

export const getMyAppointmentsSchema = z.object({
    query: z.object({
        status: z.string().optional(),
        sort: z.string().optional(),
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().optional(),
    }),
});

export const getOneSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
});

export const cancelSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
    body: z.object({
        reason: z.string().optional(),
    }),
});

export const rescheduleSchema = z.object({
    params: z.object({
        id: uuidSchema,
    }),
    body: z.object({
        date: dateSchema,
        time: timeSchema,
    }),
});

export const guestActionSchema = z.object({
    query: z.object({
        token: z.string().min(1),
    }),
});

export const guestRescheduleConfirmSchema = z.object({
    query: z.object({
        token: z.string().min(1),
    }),
    body: z.object({
        date: dateSchema,
        time: timeSchema,
    }),
});

export const holdSlotSchema = z.object({
    body: z.object({
        service_id: uuidSchema,
        date: dateSchema,
        time: timeSchema,
        user_session_id: uuidSchema,
    }),
});

export const releaseHoldSchema = z.object({
    body: z.object({
        hold_id: uuidSchema,
    }),
});
