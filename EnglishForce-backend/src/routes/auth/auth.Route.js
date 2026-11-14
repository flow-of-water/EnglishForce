import express from 'express';
import {
	register,
	login,
	logout,
	changePassword,
	refreshToken,
	resetPassword,
} from '../../controllers/auth/auth.Controller.js';
import { authMiddleware, authResetPasswordTokenMiddleware } from '../../middleware/authorize.js';
import rateLimiter from '../../middleware/rateLimit.js';

const router = express.Router();
const authLimiter = rateLimiter(100);

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', authLimiter, logout);
router.patch('/change-password', authMiddleware, changePassword);
router.post('/reset-password', authResetPasswordTokenMiddleware, resetPassword);
router.post('/refresh-token', authLimiter, refreshToken);

export default router;
