const mongoose = require("mongoose");

//------------ Product Schema ------------//
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    countInStock: {
      type: Number,
      required: false,
      default: 1
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    currency: {
      type: mongoose.Schema.Types.String,
      ref: "Currency",
    },
    rating: {
      type: Number,
    },
    reviews: [
      {
        customer_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: Number,
        date: {
          type: Date,
          default: Date.now,
        },
        description: String,
      },
    ],
    isFeatured: Boolean,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
