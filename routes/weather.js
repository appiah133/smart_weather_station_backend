const express = require('express');
const router = express.Router();
const WeatherReading = require('../models/WeatherReading');

router.get('/', async (req, res) => {
  try {
    const readings = await WeatherReading.findAll({
      order: [['timestamp', 'DESC']],
    });

    res.json(readings);

  } catch (err) {
    console.error('❌ Weather readings error:', err.message);
    res.status(500).json({ message: 'Failed to fetch weather readings' });
  }
});

module.exports = router;