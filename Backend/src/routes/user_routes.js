import { Router } from "express";
import { getUserProfile, login, register, verifyOtp } from "../controllers/user_controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/users/register").post(register);
router.route("/users/otpVerify").post(verifyOtp);
router.route("/users/login").post(login);
router.route("/users/:id").get(authMiddleware, getUserProfile);
export default router