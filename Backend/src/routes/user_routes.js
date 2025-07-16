import { Router } from "express";
import { addAddress, addToCart, addToWishlist, deleteAddress, getAllAddress, getCartItems, getUserProfile, getWishlists, login, register, removeFromCart, removeWishlist, updateAddress, updateEmail, updatePersonalInfo, verifyOtp } from "../controllers/user_controller.js";
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
router.route("/users/wishlist").post(authMiddleware, addToWishlist);
router.route("/users/wishlist").get(authMiddleware, getWishlists);
router.route("/users/wishlist").put(authMiddleware, removeWishlist);
router.route("/users/cart").post(authMiddleware, addToCart);
router.route("/users/cart").put(authMiddleware, removeFromCart);
router.route("/users/product/cart").get(authMiddleware, getCartItems);
export default router;