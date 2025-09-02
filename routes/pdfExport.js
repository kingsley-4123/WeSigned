import { Router } from "express";
import pdfExport from "../service/pdfExport.js";
const router = Router();

router.get('/:specialId/:lecturerId', pdfExport);

export default router;