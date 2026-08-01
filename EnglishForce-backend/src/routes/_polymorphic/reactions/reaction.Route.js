import { authMiddleware } from '../../../middleware/authorize.js';
import * as reactionController from '../../../controllers/_polymorphic/reaction/reaction.Controller.js';
import express from 'express';

const router = express.Router();

router.get('/number/:reactable_id', authMiddleware, reactionController.getReactionNumberByReactableId);
router.post('/numbers', authMiddleware, reactionController.getReactionNumberByReactableIds);
router.get('/:type/:id', authMiddleware, reactionController.getReactionsByTypeAndId);
router.get('/user/:type/:id', authMiddleware, reactionController.getReactionByUserAndTypeAndId);
router.post('/', authMiddleware, reactionController.createReaction);
router.delete('/', authMiddleware, reactionController.deleteReaction);

export default router;
