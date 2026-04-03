import { z } from 'zod';

const uuidSchema = z.string().uuid();
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format');

export const getAvailableSchema = z.object({
    query: z.object({
        date: dateSchema,
        service_id: uuidSchema,
        session_id: uuidSchema.optional(),
        dentist_id: uuidSchema.optional(),
    }),
});

export const getSuggestionsSchema = z.object({
    query: z.object({
        date: dateSchema,
        service_id: uuidSchema,
        time: timeSchema,
    }),
});
