// routes/exam.routes.js
import express from 'express';
import * as examController from '../../controllers/exam/examController.js';

const router = express.Router();

router.get('/', examController.getAllExams);
router.get('/:publicId', examController.getExamDetailWithQuestions);

export default router;
