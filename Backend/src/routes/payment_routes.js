import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment_controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/payment/create-order").post(createOrder);
router.route("/payment/verify").post(authMiddleware, verifyPayment);

export default router;