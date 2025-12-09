import { Router } from "express";
import { reRegister, registerLocal } from "../service/re-registration.js";

const router = Router();

router.post('/', reRegister);
router.post('/local', registerLocal);

export default router;