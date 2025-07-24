import { razorpay } from "../utils/razorpay.js";
import crypto from 'crypto';
import Payment from "../models/payment_model.js";
import dotenv from 'dotenv';
import User from '../models/user_models.js';

dotenv.config();

const createOrder = async (req, res) => {
    const { amount, currency = "INR" } = req.body;
    console.log(req.body)
    try {
        const options = {
            amount: amount * 100, // amount in paise
            currency,
            receipt: "receipt_order_" + new Date().getTime(),
        };

        const order = await razorpay.orders.create(options);
        return res.json({ success: true, order });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}

const verifyPayment = async (req, res) => {
    const { order_id, payment_id, signature, amount} = req.body;
    const id = req.user.id;
    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body)
        .digest("hex");

    const success = expectedSignature === signature;

    try {
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Save payment
        const payment = await Payment.create({
            user: existingUser._id,
            amount,
            currency: "INR",
            razorpay_order_id: order_id,
            razorpay_payment_id: payment_id,
            razorpay_signature: signature,
            success,
        });

        // Add payment reference to user
        existingUser.payments.push(payment._id);
        const updatedUser = await existingUser.save();
        console.log(updatedUser)

        return res.json({ success, message: success ? "Payment verified" : "Invalid signature" });

    } catch (err) {
        console.error("Payment verification failed:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


export { createOrder, verifyPayment };