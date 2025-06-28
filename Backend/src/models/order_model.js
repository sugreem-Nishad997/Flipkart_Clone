import mongoose, {Schema} from "mongoose";

const orderSchema = new Schema({
    user:{type: mongoose.Types.ObjectId, ref: "User", required: true},
    product: {type: mongoose.Types.ObjectId, ref: "Product", required: true},
    status: {type: String},
    date: {type: Date, default: Date.now()}
});

const Order = mongoose.model("Order", orderSchema);

export default Order;