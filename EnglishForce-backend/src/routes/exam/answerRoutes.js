import express from 'express';
import * as answerController from '../../controllers/exam/answerController.js';

const router = express.Router();

router.get('/by-question/:publicId', answerController.getAnswersByQuestionPublicId);
router.post('/', answerController.createAnswer);
router.delete('/:publicId', answerController.deleteAnswer);

export default router;
