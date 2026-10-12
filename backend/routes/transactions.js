const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const router = express.Router();

// Create sale/purchase transaction (POS)
router.post('/', auth, async (req, res) => {
  try {
    const { items, total, paymentMethod, customerName, type = 'sale' } = req.body;
    
    // Update product stock for sales
    if (type === 'sale') {
      for (let item of items) {
        await Product.findOneAndUpdate(
          { _id: item.productId, shopId: req.user._id },
          { $inc: { stock: -item.quantity } }
        );
      }
    }

    const transaction = new Transaction({
      shopId: req.user._id,
      items,
      total,
      paymentMethod,
      customerName,
      type
    });
    
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ shopId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPI Payment simulation
router.post('/upi-pay', auth, async (req, res) => {
  try {
    const { amount, upiId } = req.body;
    
    // Simulate UPI payment processing
    const payment = {
      status: 'SUCCESS',
      transactionId: 'UPI' + Date.now(),
      amount,
      upiId,
      timestamp: new Date()
    };
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

