import { z } from 'zod';

export const chatbotQuerySchema = z.object({
    body: z.object({
        message: z.string().min(1).max(500),
    }),
});
