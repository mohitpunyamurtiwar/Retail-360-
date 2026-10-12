const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number
  }],
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'cash' }, // cash, UPI
  customerName: String,
  type: { type: String, enum: ['sale', 'purchase'], default: 'sale' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

