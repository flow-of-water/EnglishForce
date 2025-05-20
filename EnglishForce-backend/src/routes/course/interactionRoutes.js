import express from 'express';
import * as interactionController from '../../controllers/course/interactionController.js';

const router = express.Router();

router.post('/', interactionController.createInteraction);
router.get('/', interactionController.getAllInteractions);
router.get('/:publicId', interactionController.getInteractionById);
router.put('/:publicId', interactionController.updateInteraction);
router.delete('/:publicId', interactionController.deleteInteraction);

export default router;
