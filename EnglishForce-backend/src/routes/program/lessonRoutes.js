import express from 'express';
import * as lessonController from '../../controllers/program/lessonController.js';

const router = express.Router();

// CRUD
router.get('/', lessonController.getAllLessons);
router.get('/:lessonPublicId', lessonController.getLessonByPublicId);
router.post('/', lessonController.createLesson);
router.put('/:lessonPublicId', lessonController.updateLesson);
router.delete('/:lessonPublicId', lessonController.deleteLesson);

export default router;
