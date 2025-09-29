import { Router } from "express";
import { syncAttendance, syncSession, getSyncedAttendance } from "../service/sync.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post('/attendance', syncAttendance);
router.post('/sessions', syncSession);
router.get('/:specialId/:attendanceName', auth, getSyncedAttendance);

export default router;