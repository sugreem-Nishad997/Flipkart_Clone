import { Router } from "express";
import { addAddress, deleteAddress, getAllAddress, getUserProfile, login, register, updateAddress, updateEmail, updatePersonalInfo, verifyOtp } from "../controllers/user_controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/users/register").post(register);
router.route("/users/otpVerify").post(verifyOtp);
router.route("/users/login").post(login);
router.route("/users/:id").get(authMiddleware, getUserProfile);
router.route("/users/name/:id").post(authMiddleware, updatePersonalInfo);
router.route("/users/email/:id").post(authMiddleware, updateEmail);
router.route("/users/:id/address").get(authMiddleware, getAllAddress);
router.route("/users/:id/address").post(authMiddleware, addAddress);
router.route("/users/:id/address/:addressId").post(authMiddleware, updateAddress);
router.route("/users/:id/address/:addressId").delete(authMiddleware, deleteAddress);
export default router