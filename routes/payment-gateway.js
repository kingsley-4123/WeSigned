import { Router } from "express";
import { createPaymentIntent, paymentWebhook } from "../service/payment-gateway.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/payment-intent", auth, createPaymentIntent);
router.post("/payment-webhook", auth, paymentWebhook);

export default router;