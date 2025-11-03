import { Router } from "express";
import { markAttendance, getAttendances } from "../service/attendance.js";
import auth from "../middlewares/auth.js";
import checkSub from "../middlewares/subscription.js";

const router = Router();

//add auth and subscription middleware.

router.get('/:specialId', auth, checkSub, getAttendances);
router.post('/:specialId/sign', auth, checkSub, markAttendance);

export default router;