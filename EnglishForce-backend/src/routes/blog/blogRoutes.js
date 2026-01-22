import express from 'express';
import * as blogController from '../../controllers/blog/blogController.js';
import { optionalAuthMiddleware, authMiddleware } from '../../middleware/authorize.js';
const router = express.Router();

router.get('/', optionalAuthMiddleware, blogController.getBlogsController);
router.get('/slug/:slug', optionalAuthMiddleware, blogController.findBlogBySlugController);
router.get('/:publicId', optionalAuthMiddleware, blogController.findBlogIdByPublicIdController);
router.post('/', authMiddleware, blogController.createBlogController);
router.put('/:publicId', authMiddleware, blogController.updateBlogController);
router.delete('/:publicId', authMiddleware, blogController.deleteBlogController);

export default router;