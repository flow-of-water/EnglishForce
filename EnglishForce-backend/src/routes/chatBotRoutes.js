// routes/geminiRoutes.js
import express from 'express';
import { generateResponseController, generateResponseWithWebDataController } from '../controllers/chatBotController.js';

const router = express.Router();

router.post('/generate', generateResponseController);
router.post('/generate2', generateResponseWithWebDataController);
export default router;
