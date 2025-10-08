// routes/auth.otp.routes.js
import express from 'express';
import limiter from '../../middleware/rateLimit.js';
import { requestOtpController, verifyOtpController } from '../../controllers/auth/otpController.js';

const router = express.Router();


// Yêu cầu gửi OTP (đăng nhập/đăng ký/…)
router.post('/request', limiter, requestOtpController);

// Xác minh OTP
router.post('/verify', limiter, verifyOtpController);

export default router;
