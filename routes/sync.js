import { Router } from "express";
import { syncAttendance, syncSession, getSyncedAttendance } from "../service/sync.js";
import auth from "../middlewares/auth.js";
import checkSub from "../middlewares/subscription.js"

const router = Router();

router.post('/attendance', syncAttendance);
router.post('/sessions', syncSession);
router.get('/:specialId/:attendanceName', auth, checkSub, getSyncedAttendance);

export default router;