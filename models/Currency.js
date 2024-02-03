const mongoose = require('mongoose');

//------------ Currency Schema ------------//
const CurrencySchema = new mongoose.Schema({
  code: {
    type: [{String}],
    required: true
  }
}, { timestamps: true });



const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;