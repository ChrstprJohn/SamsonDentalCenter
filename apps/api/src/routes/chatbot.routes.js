import { Router } from 'express';
import { queryChatbot } from '../controllers/chatbot.controller.js';
import { validate } from '../utils/validate.js';
import { chatbotQuerySchema } from '../schemas/chatbot.schema.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for chatbot to prevent spam (10 requests per minute)
const chatbotLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    message: { error: 'Too many requests from this IP, please try again after a minute' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/query', chatbotLimiter, validate(chatbotQuerySchema), queryChatbot);

export default router;
