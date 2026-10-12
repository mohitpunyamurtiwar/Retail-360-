const express = require('express');
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const router = express.Router();

// Smart pricing calculation
router.post('/calculate-price', auth, async (req, res) => {
  try {
    const { bulkQuantity, bulkPrice, marginPercent = 10, unit = 'unit' } = req.body;
    
    if (!bulkQuantity || !bulkPrice) {
      return res.status(400).json({ error: 'bulkQuantity and bulkPrice required' });
    }
    
    const costPerUnit = bulkPrice / bulkQuantity;
    const sellingPrice = costPerUnit * (1 + marginPercent / 100);
    
    const suggestion = {
      costPerUnit: parseFloat(costPerUnit.toFixed(2)),
      suggestedSellingPrice: parseFloat(sellingPrice.toFixed(2)),
      marginPercent,
      unit,
      example: `₹${bulkPrice} for ${bulkQuantity} → ₹${sellingPrice.toFixed(2)} per ${unit}`
    };
    
    res.json(suggestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk add products from bill
router.post('/bulk-add', auth, async (req, res) => {
  try {
    const { items } = req.body; // [{name, bulkQty, bulkPrice, margin}]
    
    const products = [];
    for (let item of items) {
      const pricing = await calculateSmartPrice(item.bulkQty, item.bulkPrice, item.margin || 10);
      
      const product = new Product({
        name: item.name,
        stock: item.bulkQty,
        costPrice: pricing.costPerUnit,
        sellingPrice: pricing.suggestedSellingPrice,
        unit: item.unit || 'unit',
        shopId: req.user._id
      });
      
      await product.save();
      products.push(product);
    }
    
    res.json({ products, message: `${products.length} products added` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function calculateSmartPrice(bulkQty, bulkPrice, margin) {
  const costPerUnit = bulkPrice / bulkQty;
  const sellingPrice = costPerUnit * (1 + margin / 100);
  return {
    costPerUnit: parseFloat(costPerUnit.toFixed(2)),
    suggestedSellingPrice: parseFloat(sellingPrice.toFixed(2))
  };
}

module.exports = router;

