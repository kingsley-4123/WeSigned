import { Router } from "express";
import { markAttendance, getAttendances } from "../service/attendance.js";
import auth from "../middlewares/auth.js";
import checkSub from "../middlewares/subscription.js";

const router = Router();

//add auth and subscription middleware.

router.get('/:special_id/:lecturer_id', auth, checkSub, getAttendances);
router.post('/:special_id/sign', auth, checkSub, markAttendance);

export default router;