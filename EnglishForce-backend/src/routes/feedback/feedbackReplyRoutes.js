import express from 'express';
import { authMiddleware } from '../../middleware/authorize.js';
import * as feedbackReplyController from '../../controllers/feedback/feedbackReplyController.js';
const router = express.Router();

router.get('/', feedbackReplyController.getAllFeedbackReplies);
router.post('/:feedbackId', authMiddleware, feedbackReplyController.createFeedbackReply);
export default router;  