require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import models
require('./models/User');
require('./models/WeatherReading');

const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Weather Station Backend is running' });
});

// ✅ MOUNTING ROUTES
app.use('/api/auth', authRoutes);

/** * UPDATED: Changed from /api/weather_readings to /api/weather 
 * to match your Flutter WeatherService call.
 */
app.use('/api/weather', weatherRoutes);

// Sync DB tables then start server
// Note: Render provides the PORT via process.env.PORT
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to sync database:', err.message);
  });