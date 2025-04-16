import express from "express";
import { register, login, changePassword } from "../../controllers/authController.js"
import { authMiddleware } from "../../middleware/authorize.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/change-password",authMiddleware, changePassword) ;

export default router;
