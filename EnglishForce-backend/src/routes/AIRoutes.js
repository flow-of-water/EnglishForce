// routes/geminiRoutes.js
import express from 'express';
import { generateResponseController, generateResponseWithWebDataController, 
    myChatbotController, checkWritingController, getCourseRecommendations 
} from '../controllers/AIController.js';
import { authMiddlewareWithoutError } from "../middleware/authorize.js";


const router = express.Router();

router.post('/generate', generateResponseController);
router.post('/generate2', generateResponseWithWebDataController);

router.post('/check-writing',checkWritingController);

router.post('/chatbot', myChatbotController)

router.post('/recommendations',authMiddlewareWithoutError, getCourseRecommendations);


export default router;
