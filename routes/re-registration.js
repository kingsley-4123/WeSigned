import { Router } from "express";
import reRegister from "../service/re-registration.js";

const router = Router();

router.post('/', reRegister);

export default router;