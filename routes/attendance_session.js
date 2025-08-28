import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { getAttendanceSession, createSession } from '../service/attendance-session.js';
const router = Router();

router.get('/:special_id', auth, getAttendanceSession);
router.post('/', auth, createSession);

export default router;