import express from 'express';
import * as blogController from '../../controllers/blog/blogController.js';
const router = express.Router();

router.get('/', blogController.getBlogsController);
router.get('/slug/:slug', blogController.findBlogBySlugController);
router.get('/:publicId', blogController.findBlogIdByPublicIdController);

export default router;