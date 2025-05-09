// routes/geminiRoutes.js
import express from 'express';
import { generateResponseController, generateResponseWithWebDataController, myChatbotController } from '../controllers/chatBotController.js';

const router = express.Router();

router.post('/generate', generateResponseController);
router.post('/generate2', generateResponseWithWebDataController);

router.post('/', myChatbotController)

export default router;
