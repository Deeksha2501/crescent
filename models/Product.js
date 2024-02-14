const mongoose = require("mongoose");

//------------ Product Schema ------------//
const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    countInStock: {
      type: Number,
      required: false,
      default: 1,
      displayName: "Count In Stock"
    },
    weight: {
      type: Number,
      required: true,
      displayName: "Weight(in gm)"
    },
    length: {
      type: Number,
      required: true,
      displayName: "Length(in cm)"
    },
    metalDescription: {
      type: String,
      required: true,
      displayName: "Metal Description"
    },
    purity: {
      type: String,
      required: true,
      displayName: "Purity of Metal"
    },
    warranty: {
      type: String,
      required: true,
      displayName: "Warranty Information"
    },
    stones: {
      type: String,
      required: true,
      displayName: "Stones"
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
      required: true,
      displayName: "Description"
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
