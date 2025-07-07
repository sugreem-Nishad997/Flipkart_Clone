import Product from "../models/product_model.js";
import httpStatus from 'http-status';

export const createProduct = async (req, res) => {
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

        const images = req.files.map(file => file.path);

        if (!title || !description || !price || !category || !brand || !images) {
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
