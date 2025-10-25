import { Router } from 'express';
import userService from '../service/user-service.js';

const router = Router();

router.post('/', userService);

export default router;