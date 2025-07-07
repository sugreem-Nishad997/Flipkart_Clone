import dotenv from 'dotenv';
import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'products',
        allowed_formats: ["jpg", "jpeg", "png", "svg", "webp"]
    }
});

const upload = multer({storage});

export {cloudinary, upload};