import express from 'express';
import * as blogController from '../../controllers/blog/blogController.js';
import { optionalAuthMiddleware } from '../../middleware/authorize.js';
const router = express.Router();

router.get('/', optionalAuthMiddleware, blogController.getBlogsController);
router.get('/slug/:slug', optionalAuthMiddleware, blogController.findBlogBySlugController);
router.get('/:publicId', optionalAuthMiddleware, blogController.findBlogIdByPublicIdController);

export default router;