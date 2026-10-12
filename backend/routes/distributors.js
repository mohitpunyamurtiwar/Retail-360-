const express = require('express');
const auth = require('../middleware/auth');
const Distributor = require('../models/Distributor');
const router = express.Router();

// Get distributors (mock + saved)
router.get('/', auth, async (req, res) => {
  try {
    const mockDistributors = [
      {
        name: 'Patanjali Distributor',
        contact: '+91-9876543210',
        products: [
          { name: 'Patanjali Atta 10kg', bulkPrice: 380, unit: 'kg', minOrder: 5 }
        ]
      },
      {
        name: 'ITC Wholesale',
        contact: '+91-9876543211',
        products: [
          { name: 'Aashirvaad Atta 10kg', bulkPrice: 420, unit: 'kg', minOrder: 3 },
          { name: 'Sunfeast Biscuits 48pk', bulkPrice: 285, unit: 'pack', minOrder: 2 }
        ]
      }
    ];

    const userDistributors = await Distributor.find({ shopId: req.user._id });
    
    res.json({
      distributors: [...mockDistributors, ...userDistributors],
      recommendation: 'Choose lowest price per unit'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add distributor
router.post('/', auth, async (req, res) => {
  try {
    const distributor = new Distributor({
      ...req.body,
      shopId: req.user._id
    });
    await distributor.save();
    res.status(201).json(distributor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

