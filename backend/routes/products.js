const express = require('express');
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const router = express.Router();

// Get all products for shop
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ shopId: req.user._id })
      .sort({ createdAt: -1 });
    
    // Add low stock alerts
    const productsWithAlerts = products.map(p => ({
      ...p.toObject(),
      lowStock: p.stock <= p.threshold
    }));

    res.json(productsWithAlerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add product
router.post('/', auth, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      shopId: req.user._id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, shopId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update stock
router.patch('/:id/stock', auth, async (req, res) => {
  try {
    const { quantity, operation = 'add' } = req.body; // add/subtract
    
    const product = await Product.findOne({ _id: req.params.id, shopId: req.user._id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (operation === 'add') {
      product.stock += quantity;
    } else {
      product.stock -= quantity;
      if (product.stock < 0) product.stock = 0;
    }
    
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

