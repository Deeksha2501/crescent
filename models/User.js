const mongoose = require("mongoose");

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
    },
   isMerchant : {
      type: Boolean,
      required: true,
      default: false
    },
    isVerified : {
      type: Boolean,
      required: true,
      default: false
    },
    businessOwnerName: {
      type: String
    },
    gstNumber: {
      type: Number
    },
    panCardDoc: {
      type: String
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    // cart: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product",
    //   },
    // ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
