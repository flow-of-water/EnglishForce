import reactionRoutes from './reactions/reaction.Route.js';
import express from 'express';

const router = express.Router();

router.use('/reactions', reactionRoutes);

export default router;
