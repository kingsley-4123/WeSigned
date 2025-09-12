import { Router } from 'express';
import excelExport from '../service/excelExport.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.get('/:specialId', auth, excelExport);

export default router;