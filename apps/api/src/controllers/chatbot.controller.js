import * as chatbotService from '../services/chatbot.service.js';

/**
 * POST /api/v1/chatbot/query
 * 
 * Process a user message and return an AI response.
 */
export const queryChatbot = async (req, res, next) => {
    try {
        const { message } = req.body;
        
        const response = await chatbotService.processQuery(message);
        
        res.json(response);

    } catch (err) {
        next(err);
    }
};
