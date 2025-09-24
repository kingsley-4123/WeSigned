import { Router } from "express";
import { syncAttendance, syncSession, getSyncedAttendance } from "../service/sync";
import auth from "../middlewares/auth";

const router = Router();

router.post('/attendance', syncAttendance);
router.post('/sessions', syncSession);
router.get('/:specialId/:attendanceName', auth, getSyncedAttendance);

export default router;