const mongoose = require('mongoose');

const competitorSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  location: String,
  products: [{
    name: String,
    price: Number
  }],
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Competitor', competitorSchema);

