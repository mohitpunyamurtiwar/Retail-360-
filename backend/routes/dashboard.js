const express = require('express');
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const shopId = req.user._id;
    
    // Products stats
    const products = await Product.find({ shopId });
    const lowStockProducts = products.filter(p => p.stock <= p.threshold).length;
    
    // Recent transactions
    const recentTransactions = await Transaction.find({ shopId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Monthly profit (simplified)
    const monthlySales = await Transaction.aggregate([
      { $match: { 
        shopId: shopId, 
        type: 'sale',
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }},
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    // Low stock alerts
    const alerts = products
      .filter(p => p.stock <= p.threshold)
      .map(p => ({ name: p.name, stock: p.stock, threshold: p.threshold }));
    
    res.json({
      totalProducts: products.length,
      lowStockCount: lowStockProducts,
      monthlySales: monthlySales[0]?.total || 0,
      recentTransactions,
      alerts,
      profitEstimate: monthlySales[0]?.total * 0.15 || 0 // 15% margin estimate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

