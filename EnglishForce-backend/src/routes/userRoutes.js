import express from "express";
import { getAllUsersController , updateUserRoleController, getMyUserAccountController } from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getAllUsersController);
router.get("/profile",authMiddleware, getMyUserAccountController) ;

router.patch("/:id",authMiddleware,adminMiddleware, updateUserRoleController ) ;

export default router;
