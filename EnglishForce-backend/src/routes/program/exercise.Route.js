import express from 'express';
import * as exerciseController from '../../controllers/program/exercise.Controller.js';

const router = express.Router();

router.get('/', exerciseController.getAllExercises);
router.get('/:publicId', exerciseController.getExerciseByPublicId);
router.post('/', exerciseController.createExercise);
router.put('/:publicId', exerciseController.updateExercise);
router.delete('/:publicId', exerciseController.deleteExercise);

export default router;
