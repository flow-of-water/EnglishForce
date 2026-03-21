import express from 'express';
import * as blogCategoryController from '../../controllers/blog/blogCategoryController.js';
import { adminMiddleware, authMiddleware, optionalAuthMiddleware } from '../../middleware/authorize.js';
const router = express.Router();

router.get('/', optionalAuthMiddleware, blogCategoryController.getBlogCategories);
router.get('/:publicId', optionalAuthMiddleware, blogCategoryController.findBlogCategoryByPublicId);

router.post('/', authMiddleware, adminMiddleware, blogCategoryController.createBlogCategory);
router.put('/:publicId', authMiddleware, adminMiddleware, blogCategoryController.updateBlogCategory);
router.delete('/:publicId', authMiddleware, adminMiddleware, blogCategoryController.deleteBlogCategory);

export default router;
