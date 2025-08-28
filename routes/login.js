import { Router } from "express";
import verifyUser from "../service/login.js";
import { verifyAuthResponse } from "../service/web-authn-authentication.js";

const router = Router();

router.post('/', verifyUser);
router.post('/webauthn/authenticate/verify', verifyAuthResponse);

export default router;