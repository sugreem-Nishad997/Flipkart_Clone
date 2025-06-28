import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema({
    user: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    product: {type: mongoose.Types.ObjectId, ref: "Product", required: true},
    comment: {type: String, required: true},
    title: {type: String},
    rating: {type: Number},
    date: {type: Date, default: Date.now()}
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;