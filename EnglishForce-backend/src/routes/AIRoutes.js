// routes/geminiRoutes.js
import express from 'express';
import { generateResponseController, generateResponseWithWebDataController, myChatbotController, checkWritingController } from '../controllers/chatBotController.js';

const router = express.Router();

router.post('/generate', generateResponseController);
router.post('/generate2', generateResponseWithWebDataController);

router.post('/check-writing',checkWritingController);

router.post('/chatbot', myChatbotController)

export default router;
