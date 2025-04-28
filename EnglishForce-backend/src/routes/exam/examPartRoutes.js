import express from 'express';
import * as examPartController from "../../controllers/exam/examPartController.js"
const router = express.Router();

router.post('/', examPartController.createExamPart);
router.get('/:publicId', examPartController.getExamPartByPublicId);
router.put('/:publicId', examPartController.updateExamPart);
router.delete('/:publicId', examPartController.deleteExamPart);

export default router;
