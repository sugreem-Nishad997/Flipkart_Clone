import { Schema } from "mongoose";
import mongoose from "mongoose";
import addressSchema from "./address_model.js";
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerified: Boolean,
    password: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    gender: { type: String },
    isAdmin: { type: Boolean, default: false },
    addresses: {
        type: [addressSchema],
        required: true
    },
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    cart: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
    socialProvider: { type: String, enum: ["google", "facebook", "instagram", null], default: null },
    socialId: { type: String, default: null },

});

const User = mongoose.model("User", userSchema);
export default User;