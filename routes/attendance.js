import { Router } from "express";
import { markAttendance, getAttendances } from "../service/attendance.js";
import auth from "../middlewares/auth.js";

const router = Router();

//add auth middleware.

router.get('/:special_id/:lecturer_id', auth, getAttendances);
router.post('/:special_id/sign', auth, markAttendance);

export default router;