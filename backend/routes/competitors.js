const express = require('express');
const auth = require('../middleware/auth');
const Competitor = require('../models/Competitor');
const router = express.Router();

// Get competitor data (mock + saved)
router.get('/', auth, async (req, res) => {
  try {
    // Mock competitor data for demo
    const mockCompetitors = [
      {
        shopName: 'Sharma General Store',
        location: '200m away',
        products: [
          { name: 'Parle-G', price: 5.50 },
          { name: 'Lays Chips', price: 20.00 },
          { name: 'Dabur Honey 250g', price: 195.00 }
        ]
      },
      {
        shopName: 'Gupta Kirana',
        location: '500m away',
        products: [
          { name: 'Parle-G', price: 5.00 },
          { name: 'Lays Chips', price: 22.00 }
        ]
      }
    ];

    // User saved competitors
    const userCompetitors = await Competitor.find({ shopId: req.user._id });
    
    res.json({
      competitors: [...mockCompetitors, ...userCompetitors],
      message: 'Use these prices to stay competitive!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add competitor
router.post('/', auth, async (req, res) => {
  try {
    const competitor = new Competitor({
      ...req.body,
      shopId: req.user._id
    });
    await competitor.save();
    res.status(201).json(competitor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

