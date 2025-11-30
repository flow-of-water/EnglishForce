import express from 'express';
import { register, login, logout, changePassword, refreshToken } from '../../controllers/auth/authController.js';
import { authMiddleware } from '../../middleware/authorize.js';
import rateLimiter from '../../middleware/rateLimit.js';

const router = express.Router();
const authLimiter = rateLimiter(100);

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.patch('/change-password', authMiddleware, changePassword);
router.post('/refresh-token', refreshToken);

export default router;
