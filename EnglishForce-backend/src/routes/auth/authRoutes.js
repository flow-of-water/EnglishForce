import express from "express";
import { register, login, changePassword , refreshToken } from "../../controllers/auth/authController.js";
import { authMiddleware } from "../../middleware/authorize.js";
import rateLimiter from "../../middleware/rateLimit.js";

const router = express.Router();

router.post("/register", rateLimiter(maxRequest=50), register);
router.post("/login", rateLimiter(maxRequest=50), login);
router.patch("/change-password",authMiddleware, changePassword) ;
router.post("/refresh-token",refreshToken ) ;

export default router;
