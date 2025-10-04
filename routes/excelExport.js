import { Router } from 'express';
import {excelExport, offlineExcelExport} from '../service/excelExport.js';
import auth from '../middlewares/auth.js';
import checkSub from '../middlewares/subscription.js';

const router = Router();

router.get('/:specialId', auth, checkSub, excelExport);
router.get('/:specialId/:attendanceName', auth, checkSub, offlineExcelExport);


export default router;