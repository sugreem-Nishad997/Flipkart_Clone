import User from "../models/user_models.js";
import Product from "../models/product_model.js";
import Order from "../models/order_model.js";
import httpStatus from 'http-status';


const getAllOrders = async(req, res) => {
    try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(httpStatus.OK).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export { getAllOrders}