import express from 'express';
import { stripeController } from '../controllers/stripeController.js';

const router = express.Router();

// Route tạo PaymentIntent
router.post('/', stripeController);

export default router;
