import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {getAllOrders } from "../controllers/order_controller.js";

const router = Router();

router.route("/orders/getOrders").get(authMiddleware, getAllOrders);

export default router;