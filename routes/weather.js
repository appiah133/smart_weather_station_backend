// // // const express = require('express');
// // // const router = express.Router();
// // // const axios = require('axios');
// // // const WeatherReading = require('../models/WeatherReading');

// // // // GET /api/weather/
// // // router.get('/', async (req, res) => {
// // //   try {
// // //     // 1. Get coordinates from the request query
// // //     const lat = req.query.lat || 5.56;
// // //     const lon = req.query.lon || -0.33;

// // //     /**
// // //      * 2. UPDATED URL: 
// // //      * Added 'daily' parameters for 7-day forecast (temp max/min, weather_code).
// // //      * Added 'timezone=auto' to ensure dates match the local time in Ghana.
// // //      */
// // //     const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,rain,is_day&hourly=shortwave_radiation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

// // //     const response = await axios.get(url);
// // //     const current = response.data.current;
// // //     const hourly = response.data.hourly;
// // //     const daily = response.data.daily;

// // //     // 3. Process Light Intensity (Lux Estimate)
// // //     const currentHour = new Date().getHours();
// // //     const radiation = hourly.shortwave_radiation[currentHour] || 0;
// // //     const luxEstimate = parseFloat((radiation * 120).toFixed(1));

// // //     // 4. NEW: Process 7-Day Forecast Data
// // //     const forecast = daily.time.map((date, index) => {
// // //       return {
// // //         date: date, // yyyy-mm-dd
// // //         max_temp: daily.temperature_2m_max[index],
// // //         min_temp: daily.temperature_2m_min[index],
// // //         weather_code: daily.weather_code[index],
// // //         // Helper: Format date to "Mon", "Tue", etc., on the frontend if preferred
// // //       };
// // //     });

// // //     // 5. Combine into full response
// // //     const liveReading = {
// // //       location: req.query.locationName || "Current Location",
// // //       temperature: current.temperature_2m,
// // //       humidity: current.relative_humidity_2m,
// // //       pressure: current.surface_pressure,
// // //       light_intensity: luxEstimate,
// // //       is_raining: current.rain > 0 ? "Yes" : "No",
// // //       is_day: current.is_day === 1,
// // //       timestamp: new Date(),
// // //       forecast: forecast // Sending the 7-day array to Flutter
// // //     };

// // //     res.json(liveReading);

// // //   } catch (err) {
// // //     console.error('❌ Weather fetch error:', err.message);
    
// // //     // Fallback to DB if API fails
// // //     try {
// // //       const readings = await WeatherReading.findOne({ order: [['timestamp', 'DESC']] });
// // //       if (readings) return res.json(readings);
// // //       res.status(500).json({ message: 'No data available' });
// // //     } catch (dbErr) {
// // //       res.status(500).json({ message: 'Server Error' });
// // //     }
// // //   }
// // // });

// // // module.exports = router;




















// // const express = require('express');
// // const router = express.Router();
// // const axios = require('axios');
// // const WeatherReading = require('../models/WeatherReading');

// // router.get('/', async (req, res) => {
// //   try {
// //     const lat  = parseFloat(req.query.lat)  || 5.56;
// //     const lon  = parseFloat(req.query.lon)  || -0.33;
// //     const locationName = req.query.locationName || 'Current Location';

// //     console.log(`📍 Coords received: lat=${lat}, lon=${lon}`);

// //     const url = `https://api.open-meteo.com/v1/forecast`
// //       + `?latitude=${lat}&longitude=${lon}`
// //       + `&current=temperature_2m,relative_humidity_2m,surface_pressure,rain,is_day`
// //       + `&hourly=shortwave_radiation`
// //       + `&daily=weather_code,temperature_2m_max,temperature_2m_min`
// //       + `&timezone=Africa%2FAccra`   // ← hardcode Ghana timezone, don't rely on auto
// //       + `&forecast_days=7`;

// //     console.log('🌐 Open-Meteo URL:', url);

// //     const response = await axios.get(url, { timeout: 10000 });
// //     const { current, hourly, daily } = response.data;

// //     console.log('📅 Daily forecast received:', JSON.stringify(daily));

// //     // Light intensity — use Ghana local hour
// //     const ghanaHour = new Date().getUTCHours(); // Ghana = UTC+0
// //     const radiation  = hourly.shortwave_radiation[ghanaHour] ?? 0;
// //     const luxEstimate = parseFloat((radiation * 120).toFixed(1));

// //     const forecast = daily.time.map((date, index) => ({
// //       date:         date,
// //       max_temp:     daily.temperature_2m_max[index],
// //       min_temp:     daily.temperature_2m_min[index],
// //       weather_code: daily.weather_code[index],
// //     }));

// //     const liveReading = {
// //       location:       locationName,
// //       temperature:    current.temperature_2m,
// //       humidity:       current.relative_humidity_2m,
// //       pressure:       current.surface_pressure,
// //       light_intensity: luxEstimate,
// //       is_raining:     current.rain > 0 ? 'Yes' : 'No',
// //       is_day:         current.is_day === 1,
// //       timestamp:      new Date(),
// //       forecast,
// //     };

// //     console.log('✅ Sending response:', JSON.stringify(liveReading));
// //     res.json(liveReading);

// //   } catch (err) {
// //     console.error('❌ Weather fetch error:', err.message);
// //     console.error('   Full error:', err.response?.data || err.stack);

// //     // DB fallback — note: old DB records won't have forecast, so log it clearly
// //     try {
// //       const reading = await WeatherReading.findOne({
// //         order: [['timestamp', 'DESC']],
// //       });
// //       if (reading) {
// //         console.warn('⚠️  Serving STALE DB data — forecast will be empty/wrong');
// //         return res.json(reading);
// //       }
// //       res.status(500).json({ message: 'No data available' });
// //     } catch (dbErr) {
// //       res.status(500).json({ message: 'Server Error' });
// //     }
// //   }
// // });

// // module.exports = router;
































// const express = require('express');
// const router = express.Router();
// const axios = require('axios');

// router.get('/', async (req, res) => {
//   try {
//     const lat = req.query.lat || 5.56;
//     const lon = req.query.lon || -0.33;

//     const url =
//       `https://api.open-meteo.com/v1/forecast` +
//       `?latitude=${lat}&longitude=${lon}` +
//       `&current=temperature_2m,relative_humidity_2m,surface_pressure,rain,is_day` +
//       `&hourly=shortwave_radiation` +
//       `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
//       `&timezone=auto`;

//     const response = await axios.get(url);

//     const { current, hourly, daily } = response.data;

//     // safer lux calculation
//     const luxEstimate =
//       (hourly.shortwave_radiation?.[0] ?? 0) * 120;

//     const forecast = daily.time.map((date, i) => {
//       const code = daily.weather_code[i];

//       return {
//         date,
//         max_temp: daily.temperature_2m_max[i],
//         min_temp: daily.temperature_2m_min[i],
//         weather_code: code,

//         // ✅ ENRICHED DATA (IMPORTANT FIX)
//         condition: codeToCondition(code),
//         icon: codeToIcon(code),
//       };
//     });

//     const liveReading = {
//       location: req.query.locationName || "Current Location",
//       temperature: current.temperature_2m,
//       humidity: current.relative_humidity_2m,
//       pressure: current.surface_pressure,
//       light_intensity: luxEstimate,
//       is_raining: current.rain > 0 ? "Yes" : "No",
//       is_day: current.is_day === 1,
//       timestamp: new Date(),
//       forecast,
//     };

//     res.json(liveReading);

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: "Weather fetch failed" });
//   }
// });

// // ── WMO helpers (MOVE SERVER-SIDE FOR CONSISTENCY)
// function codeToCondition(code) {
//   if (code === 0) return "Sunny";
//   if (code <= 2) return "Partly Cloudy";
//   if (code === 3) return "Cloudy";
//   if (code <= 48) return "Foggy";
//   if (code <= 55) return "Drizzle";
//   if (code <= 65) return "Rain";
//   if (code <= 82) return "Showers";
//   if (code <= 99) return "Thunderstorm";
//   return "Unknown";
// }

// function codeToIcon(code) {
//   if (code === 0) return "☀️";
//   if (code <= 2) return "⛅";
//   if (code === 3) return "☁️";
//   if (code <= 48) return "🌫️";
//   if (code <= 65) return "🌧️";
//   if (code <= 82) return "🌦️";
//   if (code <= 99) return "⛈️";
//   return "🌡️";
// }

// module.exports = router;




















const express = require('express');
const router = express.Router();
const axios = require('axios');
const WeatherReading = require('../models/WeatherReading');

// ── Smart condition resolver ──────────────────────────────────────────────────
// Open-Meteo often returns high WMO codes (overcast/fog) for coastal Ghana even
// when actual rainfall probability is low. We override with precip probability
// to give a more realistic condition.
function resolveWeatherCode(rawCode, precipProbability) {
  const prob = precipProbability ?? 0;

  // If Open-Meteo says thunderstorm/heavy rain but probability is low → downgrade
  if (rawCode >= 95 && prob < 60) return 3;   // overcast, not thunderstorm
  if (rawCode >= 80 && prob < 40) return 3;   // overcast, not showers
  if (rawCode >= 61 && prob < 30) return 3;   // overcast, not rain
  if (rawCode >= 51 && prob < 20) return 2;   // partly cloudy, not drizzle
  if (rawCode === 3  && prob < 10) return 2;  // partly cloudy, not fully overcast

  return rawCode; // trust the code if probability supports it
}

router.get('/', async (req, res) => {
  try {
    const lat          = parseFloat(req.query.lat) || 5.56;
    const lon          = parseFloat(req.query.lon) || -0.33;
    const locationName = req.query.locationName    || 'Current Location';

    console.log(`📍 Coords received: lat=${lat}, lon=${lon}`);

    const url = `https://api.open-meteo.com/v1/forecast`
      + `?latitude=${lat}&longitude=${lon}`
      + `&current=temperature_2m,relative_humidity_2m,surface_pressure,rain,is_day`
      + `&hourly=shortwave_radiation`
      + `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max`
      + `&timezone=Africa%2FAccra`
      + `&forecast_days=7`;

    console.log('🌐 Open-Meteo URL:', url);

    const response = await axios.get(url, { timeout: 10000 });
    const { current, hourly, daily } = response.data;

    console.log('📅 Daily forecast received:', JSON.stringify(daily));

    // Light intensity — Ghana is UTC+0 so getUTCHours() is correct
    const ghanaHour  = new Date().getUTCHours();
    const radiation  = hourly.shortwave_radiation[ghanaHour] ?? 0;
    const luxEstimate = parseFloat((radiation * 120).toFixed(1));

    const forecast = daily.time.map((date, index) => {
      const rawCode   = daily.weather_code[index];
      const precipPct = daily.precipitation_probability_max[index] ?? 0;
      const resolvedCode = resolveWeatherCode(rawCode, precipPct);

      return {
        date:                       date,
        max_temp:                   daily.temperature_2m_max[index],
        min_temp:                   daily.temperature_2m_min[index],
        weather_code:               resolvedCode,
        precipitation_probability:  precipPct,
      };
    });

    const liveReading = {
      location:        locationName,
      temperature:     current.temperature_2m,
      humidity:        current.relative_humidity_2m,
      pressure:        current.surface_pressure,
      light_intensity: luxEstimate,
      is_raining:      current.rain > 0 ? 'Yes' : 'No',
      is_day:          current.is_day === 1,
      timestamp:       new Date(),
      forecast,
    };

    console.log('✅ Sending response:', JSON.stringify(liveReading));
    res.json(liveReading);

  } catch (err) {
    console.error('❌ Weather fetch error:', err.message);
    console.error('   Full error:', err.response?.data || err.stack);

    try {
      const reading = await WeatherReading.findOne({
        order: [['timestamp', 'DESC']],
      });
      if (reading) {
        console.warn('⚠️  Serving STALE DB data — forecast will be empty/wrong');
        return res.json(reading);
      }
      res.status(500).json({ message: 'No data available' });
    } catch (dbErr) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
});

module.exports = router;