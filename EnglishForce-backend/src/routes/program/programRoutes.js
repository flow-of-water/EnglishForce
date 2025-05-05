import express from 'express';
import * as programController from '../../controllers/program/programController.js';
import { uploadImage } from "../../config/cloudinary.config.js";

const router = express.Router();

router.get('/', programController.getAllPrograms);
router.get('/:public_id', programController.getProgramDetail);

router.post('/', uploadImage.single('thumbnail'), programController.createProgram);

router.delete('/:publicId', programController.deleteProgramByPublicId);


export default router;
