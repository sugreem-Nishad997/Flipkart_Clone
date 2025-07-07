import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { createProduct } from "../controllers/product_controller.js";
import {upload} from '../utils/cloudinary.js';

const router = Router();

router.route("/admin/addProduct").post(authMiddleware, adminMiddleware, upload.array("images", 5), createProduct);

export default router;