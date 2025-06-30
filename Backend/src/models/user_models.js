import { Schema } from "mongoose";
import mongoose from "mongoose";
import addressSchema from "./address_model.js";
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerified: Boolean,
    password: { type: String, required: true },
    otp: { type: String },
    otpExpiry: { type: Date },
    gender: { type: String },
    isAdmin: { type: Boolean, default: false },
    addresses: {
        type: [addressSchema],
        required: true
    }
});

const User = mongoose.model("User", userSchema);
export default User;