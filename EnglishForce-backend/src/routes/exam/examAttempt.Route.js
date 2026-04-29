// routes/exam.routes.js
import express from 'express';
import * as examAttemptController from '../../controllers/exam/examAttempt.Controller.js';
import { adminMiddleware, authMiddleware, optionalAuthMiddleware } from '../../middleware/authorize.js';
const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, examAttemptController.getPaginatedAttempts);
router.get('/:publicId/user', optionalAuthMiddleware, examAttemptController.getUserExamAttempts);

export default router;
