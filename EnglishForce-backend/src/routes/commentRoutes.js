import express from "express"
import * as commentController from "../controllers/commentController.js"

const router = express.Router();

router.get('/', commentController.getPaginatedCommentsController);
router.get('/:courseId', commentController.getDetailCommentsByCourseIdController);
router.post('/', commentController.createComment);
router.delete('/:id', commentController.deleteCommentController);
router.patch('/:commentId', commentController.editCommentController);


export default router ;
