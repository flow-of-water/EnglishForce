import { authMiddleware } from '../../middleware/authorize.js';
import * as feedbackController from './../../controllers/feedback/feedback.Controller.js';
import { uploadImage } from '../../config/cloudinary.config.js';
import express from 'express';

const router = express.Router();

router.get('/', authMiddleware, feedbackController.getAllFeedbacks);
router.get('/:id', authMiddleware, feedbackController.getFeedbackById);
router.post('/', authMiddleware, uploadImage.single('thumbnail'), feedbackController.createFeedback);
router.put('/:id', authMiddleware, uploadImage.single('thumbnail'), feedbackController.updateFeedback);

export default router;
