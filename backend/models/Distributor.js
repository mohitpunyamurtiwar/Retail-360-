const mongoose = require('mongoose');

const distributorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: String,
  products: [{
    name: String,
    bulkPrice: Number,
    unit: String,
    minOrder: Number
  }],
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Distributor', distributorSchema);

