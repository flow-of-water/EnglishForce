import express from 'express';
import { stripeController } from '../../controllers/course/stripe.Controller.js';

const router = express.Router();

// Route tạo PaymentIntent
router.post('/', stripeController);

export default router;
