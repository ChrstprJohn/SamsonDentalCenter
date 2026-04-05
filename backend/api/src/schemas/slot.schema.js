import { z } from 'zod';

const stringRequired = z.string().min(1);
const stringSchema = z.string().nullish();

export const getAvailableSchema = z.object({
    query: z.object({
        date: stringRequired,
        service_id: stringRequired,
        session_id: stringSchema,
        dentist_id: stringSchema,
    }).passthrough(),
    body: z.any(),
    params: z.any(),
}).passthrough();

export const getSuggestionsSchema = z.object({
    query: z.object({
        date: stringRequired,
        service_id: stringRequired,
        time: stringRequired,
    }).passthrough(),
    body: z.any(),
    params: z.any(),
}).passthrough();
