import express from 'express';
import {
	getPagingUsersController,
	updateUserRoleController,
	getMyUserAccountController,
	updateAvatarController,
} from '../controllers/user.Controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/authorize.js';
import { uploadImage } from '../config/cloudinary.config.js';

const router = express.Router();

router.get('/', getPagingUsersController);
router.get('/profile', authMiddleware, getMyUserAccountController);
router.patch('/avatar', authMiddleware, uploadImage.single('avatar'), updateAvatarController);

router.patch('/:publicId', authMiddleware, adminMiddleware, updateUserRoleController);

export default router;
