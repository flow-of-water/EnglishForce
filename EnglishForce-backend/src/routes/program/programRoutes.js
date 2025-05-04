import express from 'express';
import * as programController from '../../controllers/program/programController.js';

const router = express.Router();

router.get('/', programController.getAllPrograms);
router.get('/:public_id', programController.getProgramDetail);

router.delete('/:publicId', programController.deleteProgramByPublicId);


export default router;
