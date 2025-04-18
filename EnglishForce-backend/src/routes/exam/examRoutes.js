// routes/exam.routes.js
import express from 'express';
import * as examController from '../../controllers/exam/examController.js';
import { authMiddlewareWithoutError } from '../../middleware/authorize.js';
const router = express.Router();

router.get('/', examController.getAllExams);
router.get('/:publicId',authMiddlewareWithoutError, examController.getExamDetailWithQuestions);
router.post('/attempts',authMiddlewareWithoutError, examController.submitExamAttempt);
router.get('/attempts/result/:publicId',authMiddlewareWithoutError, examController.getExamResult);


export default router;
