import { Router } from "express";
import { googleLogin, login, otpLogin, register, resendOtp, verifyOtp } from "../controllers/auth_controller.js";


const router = Router();

router.route("/auth/register").post(register);
router.route("/auth/otpVerify").post(verifyOtp);
router.route("/auth/resendOtp").post(resendOtp);
router.route("/auth/login").post(login);
router.route("/auth/otpLogin").post(otpLogin);
router.route("/auth/socialLogin").post(googleLogin);
export default router;