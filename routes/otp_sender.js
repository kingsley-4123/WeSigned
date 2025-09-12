import { Router } from "express";
import { sendOTP, verifyOTP } from "../service/otp_sender.js";

const router = Router();

router.post('/send', sendOTP);
router.post('/verify', verifyOTP);

export default router;
