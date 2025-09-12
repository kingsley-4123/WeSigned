import { Router } from "express";
import pdfExport from "../service/pdfExport.js";
import auth from "../middlewares/auth.js";
const router = Router();

router.get('/:specialId', auth, pdfExport);

export default router;