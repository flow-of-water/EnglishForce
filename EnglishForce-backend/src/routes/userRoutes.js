import express from "express";
import { getAllUsersController , updateUserRoleController, getUserByIdController } from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getAllUsersController);
router.get("/profile/:userId",getUserByIdController) ;

router.patch("/:id",authMiddleware,adminMiddleware, updateUserRoleController ) ;

export default router;
