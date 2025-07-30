import { razorpay } from "../utils/razorpay.js";
import crypto from 'crypto';
import Payment from "../models/payment_model.js";
import dotenv from 'dotenv';
import User from '../models/user_models.js';
import Order from "../models/order_model.js";
import Product from "../models/product_model.js";
import { sendEmail } from "../utils/sendEmail.js";

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
    const { order_id, payment_id, signature, amount, orderItems, shippingInfo, totalAmount } = req.body;
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
        await existingUser.save();
        const productIds = orderItems.map(item => item._id);
        const dbProducts = await Product.find({_id: {$in: productIds}});
        const orderedItems = orderItems.map(ordered => {
            const matchecProduct = dbProducts.find(prod => prod._id.toString() === ordered._id);
            return{
                product: matchecProduct._id,
                name: matchecProduct.title,
                price: matchecProduct.price,
                discount: matchecProduct.discount,
                image: matchecProduct.images[0]?.url||'',
            }
        });

        const order = new Order({
            user: req.user.id,
            orderItems: orderedItems,
            shippingInfo,
            totalAmount,
            isPaid: true,
            paidAt: new Date(),
            paymentInfo: {
                id: payment_id,
                status: "Success"
            },
            status: 'Products Ordered'
        });

        await order.save();
        existingUser.orders.push(order._id);
        await existingUser.save();

        if (existingUser.cart && existingUser.cart.length > 0) {
            existingUser.cart = existingUser.cart.filter(cartItem => {
                return !orderItems.some(ordered => ordered._id === cartItem._id.toString());
            });
        }
        const updatedUser = await existingUser.save();

        await sendEmail(existingUser.email, success ? "Payment Successfull" : "Payment Failed", success ? `Your payment is successful for OrderId: ${orderItems[0]._id} and Amount of ${totalAmount}`:   "FAiled");

        return res.json({ success, message: success ? "Payment verified" : "Invalid signature", updatedUser });

    } catch (err) {
        console.error("Payment verification failed:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


export { createOrder, verifyPayment };