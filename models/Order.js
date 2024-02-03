const mongoose = require('mongoose');

//------------ Order Schema ------------//
const OrderSchema = new mongoose.Schema({
  productId: {
    type : mongoose.Schema.Types.ObjectId,
      ref : "Product"
  },
  customerId: {
    type : mongoose.Schema.Types.ObjectId,
      ref : "User"
  },
  dateOrdered: {
    type:Date,
    default:Date.now
  },
  status :{
    type : String,
    required : true
  }

}, { timestamps: true });



const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;