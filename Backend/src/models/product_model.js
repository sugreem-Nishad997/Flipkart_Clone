import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
    index: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['mobile', 'laptop', 'furniture', 'clothing', 'electronics', 'Beauty', 'other'],
    index: true
  },
  brand: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    required: true,
    min: [10, 'Discount must be greater than 10%']
  },
  images: [
    {
      url: {
        type: String,
        required: true,
        validate: {
          validator: v => /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(v),
          message: props => `${props.value} is not a valid image URL`,
        }
      },
      public_id: { type: String, required: true }
    }
  ],
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  specs: {
    type: mongoose.Schema.Types.Mixed, // e.g., { ram, model, material, etc. }
    default: {},
  },
  size: [String],
  gender: { type: String },
  isAvailable: {
    type: Boolean,
    default: true,
  }
});

productSchema.index({ title: 'text', description: 'text', brand: 'text' });

const Product = mongoose.model("Product", productSchema);

export default Product;