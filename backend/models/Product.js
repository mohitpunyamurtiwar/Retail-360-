const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  stock: { type: Number, default: 0 },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  unit: { type: String, default: 'unit' }, // kg, liter, unit, etc.
  threshold: { type: Number, default: 5 },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

