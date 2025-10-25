import { Router } from "express";
import { sendOTP, verifyOTP, updatePassword } from "../service/otp_sender.js";

const router = Router();

router.post('/send', sendOTP);
router.post('/verify', verifyOTP);
router.post('/update-password', updatePassword);


export default router;
