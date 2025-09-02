import { Router } from 'express';
import excelExport from '../service/excelExport.js';

const router = Router();

router.get('/:specialId/:lecturerId', excelExport);

export default router;