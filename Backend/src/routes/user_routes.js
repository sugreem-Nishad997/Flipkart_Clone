import { Router } from "express";
import { login, register, verifyOtp } from "../controllers/user_controller.js";

const router = Router();

router.route("/users/register").post(register);
router.route("/users/otpVerify").post(verifyOtp);
router.route("/users/login").post(login);

export default router