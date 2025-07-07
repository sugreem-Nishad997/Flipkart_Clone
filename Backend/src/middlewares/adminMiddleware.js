import User from "../models/user_models.js";

const adminMiddleware = async (req, res, next) => {
    try {
        let id = req.user.id;
        const result = await User.findById(id);
        if (result && result.isAdmin) {
            return next();
        } else {
            res.status(403).json({ message: "Admin access only" })
        }
    } catch (error) {
        console.error("Admin check failed:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export { adminMiddleware }