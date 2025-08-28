import { Router } from 'express';
import userService from '../service/user-service.js';
import { verifyRegResponse } from '../service/web-authn-registration.js';

const router = Router();

router.post('/', userService);
router.post('/webauthn/register/verify', verifyRegResponse);


export default router;