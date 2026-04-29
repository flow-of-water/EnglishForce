import express from 'express';
import * as blogController from '../../controllers/blog/blog.Controller.js';
import { optionalAuthMiddleware, authMiddleware } from '../../middleware/authorize.js';
import { uploadImage } from '../../config/cloudinary.config.js';
const router = express.Router();

router.get('/', optionalAuthMiddleware, blogController.getBlogsController);
router.get('/slug/:slug', optionalAuthMiddleware, blogController.findBlogBySlugController);
router.get('/:publicId', optionalAuthMiddleware, blogController.findBlogIdByPublicIdController);
router.post('/', authMiddleware, blogController.createBlogController);
router.put('/slug/:slug', authMiddleware, uploadImage.single('thumbnail'), blogController.updateBlogBySlugController);
router.put('/:publicId', authMiddleware, uploadImage.single('thumbnail'), blogController.updateBlogController);
router.delete('/:publicId', authMiddleware, blogController.deleteBlogController);

export default router;
