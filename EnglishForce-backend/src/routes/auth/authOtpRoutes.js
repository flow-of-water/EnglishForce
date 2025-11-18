// routes/auth.otp.routes.js
import express from 'express';
import rateLimiter from '../../middleware/rateLimit.js';
import { requestOtpController, verifyOtpController } from '../../controllers/auth/otpController.js';

const router = express.Router();

const otpLimiter = rateLimiter(50);

// Yêu cầu gửi OTP (đăng nhập/đăng ký/…)
router.post('/request', otpLimiter, requestOtpController);

// Xác minh OTP
router.post('/verify', otpLimiter, verifyOtpController);

export default router;
