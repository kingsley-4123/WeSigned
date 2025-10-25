import { Router } from "express";
import verifyUser from "../service/login.js";

const router = Router();

router.post('/', verifyUser);

export default router;