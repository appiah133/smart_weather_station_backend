const express = require('express');
const router = express.Router();
const axios = require('axios');
const WeatherReading = require('../models/WeatherReading');

// GET /api/weather/
router.get('/', async (req, res) => {
  try {
    // 1. Get coordinates from the request query
    const lat = req.query.lat || 5.56;
    const lon = req.query.lon || -0.33;

    /**
     * 2. UPDATED URL: 
     * Added 'daily' parameters for 7-day forecast (temp max/min, weather_code).
     * Added 'timezone=auto' to ensure dates match the local time in Ghana.
     */
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,rain,is_day&hourly=shortwave_radiation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await axios.get(url);
    const current = response.data.current;
    const hourly = response.data.hourly;
    const daily = response.data.daily;

    // 3. Process Light Intensity (Lux Estimate)
    const currentHour = new Date().getHours();
    const radiation = hourly.shortwave_radiation[currentHour] || 0;
    const luxEstimate = parseFloat((radiation * 120).toFixed(1));

    // 4. NEW: Process 7-Day Forecast Data
    const forecast = daily.time.map((date, index) => {
      return {
        date: date, // yyyy-mm-dd
        max_temp: daily.temperature_2m_max[index],
        min_temp: daily.temperature_2m_min[index],
        weather_code: daily.weather_code[index],
        // Helper: Format date to "Mon", "Tue", etc., on the frontend if preferred
      };
    });

    // 5. Combine into full response
    const liveReading = {
      location: req.query.locationName || "Current Location",
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      pressure: current.surface_pressure,
      light_intensity: luxEstimate,
      is_raining: current.rain > 0 ? "Yes" : "No",
      is_day: current.is_day === 1,
      timestamp: new Date(),
      forecast: forecast // Sending the 7-day array to Flutter
    };

    res.json(liveReading);

  } catch (err) {
    console.error('❌ Weather fetch error:', err.message);
    
    // Fallback to DB if API fails
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