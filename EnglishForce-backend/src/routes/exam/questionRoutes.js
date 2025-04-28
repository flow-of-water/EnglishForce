import express from 'express';
import * as questionController from "../../controllers/exam/questionController.js"
const router = express.Router() ;

router.get('/exam/:publicId', questionController.getQuestionsByExam);      // GET questions by exam publicId
router.get('/exam-parts/:partPublicId', questionController.getQuestionsByPartId);   // GET questions by exam Part publicId
router.post('/', questionController.createQuestion);                       // POST new question
router.delete('/:publicId', questionController.deleteQuestion);            // DELETE question by publicId


router.get('/:publicId', questionController.getQuestionByPublicId); 

export default router;