import Product from "../models/product_model.js";
import httpStatus from 'http-status';

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

        const images = req.files.map(file => file.path);
        if (!title || !description || !price || !category || !brand || images.length === 0) {
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

const showProduct = async(req, res) => {
    const id = req.params.id;
    try {
        if(!id) return res.json({message:"Please provide ProductID", success:false});

        const product = await Product.findById(id);
        if(!product) return res.json({message:"Product not found", success:fasle});

        res.status(httpStatus.OK).json({message:"Product Founded", success:true, product});

    } catch (error) {
        console.error(error);
        res.status(500).json({error:error.message, success:false});
    }
}

const showAllProducts = async(req, res) => {
    try {
        const products = await Product.find();
        res.status(httpStatus.OK).json({message:"All Product Fetched", success:true, products});
    } catch (error) {
        res.status(500).json({error:error.message, success:false});
    }
}

export {createProduct, showProduct, showAllProducts};