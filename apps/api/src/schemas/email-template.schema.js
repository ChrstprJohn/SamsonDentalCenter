import { z } from 'zod';

/**
 * Schema for updating an email template
 */
export const updateTemplateSchema = z.object({
    body: z.object({
        subject_line: z.string()
            .min(5, 'Subject line must be at least 5 characters')
            .max(255, 'Subject line is too long'),
        html_content: z.string()
            .min(50, 'HTML content seems too short for a valid template')
            .refine(val => {
                // Basic HTML tag presence check
                return val.includes('<') && val.includes('>');
            }, { message: 'Content must contain valid HTML tags' })
    }),
    params: z.object({
        key: z.string().min(1, 'Template key is required')
    }),
    query: z.object({})
});
