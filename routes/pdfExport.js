import { Router } from "express";
import {pdfExport, offlinePdfExport} from "../service/pdfExport.js";
import auth from "../middlewares/auth.js";
const router = Router();

router.get('/:specialId', auth, pdfExport);
router.get('/:specialId/:attendanceName', auth, offlinePdfExport);

export default router;