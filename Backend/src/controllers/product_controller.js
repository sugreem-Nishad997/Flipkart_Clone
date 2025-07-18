import Product from "../models/product_model.js";
import User from "../models/user_models.js";
import httpStatus from 'http-status';
import { cloudinary } from "../utils/cloudinary.js";

const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            size,
            gender,
            price,
            stock,
            discount,
            brand,
            category,
            specs,
        } = req.body;

        const images = req.files.map(file => ({
            url: file.path,
            public_id: file.filename
        }));
        if (!title || !description || !price || !category || !brand || !discount || images.length === 0) {
            return res.json({ message: "All fields are required", success: false });
        }

        const product = new Product({
            title,
            description,
            size,
            gender,
            price,
            stock,
            discount,
            brand,
            category,
            specs: JSON.parse(specs),
            images,
        });
        await product.save();
        res.status(httpStatus.CREATED).json({ success: true, message: 'Product created successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const showProduct = async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) return res.json({ message: "Please provide ProductID", success: false });

        const product = await Product.findById(id);
        if (!product) return res.json({ message: "Product not found", success: fasle });

        res.status(httpStatus.OK).json({ message: "Product Founded", success: true, product });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message, success: false });
    }
}

const showAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(httpStatus.OK).json({ message: "All Product Fetched", success: true, products });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
}

const updateProduct = async (req, res) => {
    try {
        const id = req.user.id;
        if (!id) return res.json({ message: "Unauthorized", success: false });

        const user = await User.findById(id);
        if (!user || !user.isVerified || !user.isAdmin) return res.json({ message: 'User not allowed to update product', success: false });

        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        const specs = JSON.parse(req.body.specs);
        const existingImages = req.body["existingImages[]"]
            ? Array.isArray(req.body["existingImages[]"])
                ? req.body["existingImages[]"]
                : [req.body["existingImages[]"]]
            : product.images.map(img => img.url);
        // console.log(req.body)


        let newUploadedImages = [];

        if (req.files?.length > 0) {
            newUploadedImages = req.files.map(file => ({
                url: file.path,
                public_id: file.filename
            }));
        }
        const removedImages = product.images.filter(img => !existingImages.includes(img.url));

        for (const img of removedImages) {
            if (img.public_id) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        const keptImages = product.images.filter(img => existingImages.includes(img.url));
        product.images = [...keptImages, ...newUploadedImages];
        // Update fields
        Object.assign(product, {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            discount: req.body.discount,
            stock: req.body.stock,
            size: req.body.size ? (Array.isArray(req.body.size) ? req.body.size : [req.body.size]) : [],
            gender: req.body.gender,
            category: req.body.category,
            brand: req.body.brand,
            specs,
        });

        const Updatedproduct = await product.save();
        if (!Updatedproduct) return res.json({ message: 'Product not updated', success: false });
        res.status(httpStatus.CREATED).json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export { createProduct, showProduct, showAllProducts, updateProduct };