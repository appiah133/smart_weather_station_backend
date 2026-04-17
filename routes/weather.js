// const express = require('express');
// const router = express.Router();
// const WeatherReading = require('../models/WeatherReading');

// router.get('/', async (req, res) => {
//   try {
//     const readings = await WeatherReading.findAll({
//       order: [['timestamp', 'DESC']],
//     });

//     res.json(readings);

//   } catch (err) {
//     console.error('❌ Weather readings error:', err.message);
//     res.status(500).json({ message: 'Failed to fetch weather readings' });
//   }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const axios = require('axios');
const WeatherReading = require('../models/WeatherReading');

// GET /api/weather/
// Now accepts dynamic lat and lon from your Flutter Location Service
router.get('/', async (req, res) => {
  try {
    // 1. Get coordinates from the request query (fallback to Weija if missing)
    const lat = req.query.lat || 5.56;
    const lon = req.query.lon || -0.33;

    // 2. Use the dynamic coordinates in the API URL
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,rain,is_day&hourly=shortwave_radiation&forecast_days=1`;

    const response = await axios.get(url);
    const current = response.data.current;
    const hourly = response.data.hourly;

    // 3. Process data for your dashboard
    const currentHour = new Date().getHours();
    const radiation = hourly.shortwave_radiation[currentHour] || 0;
    const luxEstimate = parseFloat((radiation * 120).toFixed(1));

    const liveReading = {
      location: req.query.locationName || "Current Location",
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      pressure: current.surface_pressure,
      light_intensity: luxEstimate,
      is_raining: current.rain > 0 ? "Yes" : "No",
      is_day: current.is_day === 1,
      timestamp: new Date()
    };

    res.json(liveReading);

  } catch (err) {
    console.error('❌ Weather fetch error:', err.message);
    
    // Fallback to DB
    try {
      const readings = await WeatherReading.findOne({ order: [['timestamp', 'DESC']] });
      if (readings) return res.json(readings);
      res.status(500).json({ message: 'No data available' });
    } catch (dbErr) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
});

module.exports = router;