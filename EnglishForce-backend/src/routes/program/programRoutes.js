import express from 'express';
import * as programController from '../../controllers/program/programController.js';
import { authMiddleware, adminMiddleware } from '../../middleware/authorize.js';
import { uploadImage } from "../../config/cloudinary.config.js";

const router = express.Router();

router.get('/',authMiddleware, programController.getPaginatedPrograms);
router.get('/status',authMiddleware, programController.getAllProgramsWithStatus);
router.get('/:public_id',authMiddleware, programController.getProgramDetail);

router.post('/', authMiddleware, adminMiddleware, uploadImage.single('thumbnail'), programController.createProgram);

router.delete('/:publicId', authMiddleware, adminMiddleware, programController.deleteProgramByPublicId);


export default router;
