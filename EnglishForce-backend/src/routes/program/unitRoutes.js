import express from 'express';
import * as unitController from '../../controllers/program/unitController.js';
import { authMiddleware, adminMiddleware } from '../../middleware/authorize.js';

const router = express.Router();

// GET tất cả Unit
router.get('/', unitController.getAllUnits);

// GET chi tiết Unit theo public_id
router.get('/:publicId', unitController.getUnitByPublicId);

// GET tất cả Unit của 1 Program
router.get('/program/:programPublicId', unitController.getUnitsByProgramPublicId);


router.put('/:publicUnitId', authMiddleware, adminMiddleware, unitController.updateUnit);

export default router;
