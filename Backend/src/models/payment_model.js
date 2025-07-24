import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: Number,
  currency: { type: String, default: "INR" },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  success: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
