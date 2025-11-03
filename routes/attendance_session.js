import { Router } from 'express';
import auth from '../middlewares/auth.js';
import checkSub from '../middlewares/subscription.js';
import { getAttendanceSession, createSession } from '../service/attendance-session.js';
const router = Router();

router.get('/:specialId', auth, checkSub, getAttendanceSession);
router.post('/', auth, checkSub, createSession);

export default router; 