import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    try {
        console.log("yuse")
        const verified = jwt.verify(token, secret);
        req.user = verified; 
        next();
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: 'Invalid Token' });
    }
}

export {authMiddleware}