import { Router } from "express";
import { createPaymentIntent, paymentWebhook } from "../service/payment-gateway.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/payment-intent", createPaymentIntent);
router.post("/payment-webhook", paymentWebhook);

export default router;