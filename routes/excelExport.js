import { Router } from 'express';
import {excelExport, offlineExcelExport} from '../service/excelExport.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.get('/:specialId', auth, excelExport);
router.get('/:specialId/:attendanceName', auth, offlineExcelExport);


export default router;