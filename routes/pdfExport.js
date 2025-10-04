import { Router } from "express";
import {pdfExport, offlinePdfExport} from "../service/pdfExport.js";
import auth from "../middlewares/auth.js";
import checkSub from "../middlewares/subscription.js";
const router = Router();

router.get('/:specialId', auth, checkSub, pdfExport);
router.get('/:specialId/:attendanceName', auth, checkSub, offlinePdfExport);

export default router;