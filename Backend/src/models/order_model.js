import mongoose, { Schema } from "mongoose";
import addressSchema from "./address_model.js";

const orderSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,           
            price: Number, 
            discount: Number,         
            image: String,          
        }
    ],
    shippingInfo: { type: addressSchema, required: true },
    totalAmount: Number,
    isPaid: { type: Boolean, default: false },
    status: { type: String },
    date: { type: Date, default: Date.now() },
    paymentInfo: {
        id: String,
        status: String
    }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;