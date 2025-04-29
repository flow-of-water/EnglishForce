import express from 'express';
import * as examPartController from "../../controllers/exam/examPartController.js"
import { uploadMixed } from "../../config/cloudinary.config.js";



const router = express.Router();

router.post('/', examPartController.createExamPart);
router.get('/:publicId', examPartController.getExamPartByPublicId);
router.put('/:publicId', uploadMixed.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'record', maxCount: 1 }
]),
    examPartController.updateExamPart);

router.delete('/:publicId', examPartController.deleteExamPart);

export default router;
