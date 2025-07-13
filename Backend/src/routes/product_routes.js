import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { createProduct, showAllProducts, showProduct } from "../controllers/product_controller.js";
import {upload} from '../utils/cloudinary.js';

const router = Router();

router.route("/admin/addProduct").post(authMiddleware, adminMiddleware, upload.array("images", 5), createProduct);
router.route("/:id").get(showProduct);
router.route("/admin/allProducts").get(authMiddleware, adminMiddleware, showAllProducts);
export default router;