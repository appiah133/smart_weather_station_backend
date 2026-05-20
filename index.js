// // require('dotenv').config();
// // const express   = require('express');
// // const cors      = require('cors');
// // const sequelize = require('./config/database');

// // require('./models/User');
// // require('./models/WeatherReading');

// // const authRoutes   = require('./routes/auth');
// // const weatherRoutes = require('./routes/weather');
// // const notifyRoutes  = require('./routes/notify');  // ← NEW

// // const app = express();

// // app.use(cors());
// // app.use(express.json());

// // app.get('/', (req, res) => {
// //   res.json({ status: 'OK', message: 'Smart Weather Station Backend is running' });
// // });

// // app.use('/api/auth',    authRoutes);
// // app.use('/api/weather', weatherRoutes);
// // app.use('/api/notify',  notifyRoutes);  // ← NEW

// // const PORT = process.env.PORT || 5000;

// // sequelize.sync({ alter: true })
// //   .then(() => {
// //     console.log('✅ Database synced');
// //     app.listen(PORT, '0.0.0.0', () => {
// //       console.log(`🚀 Server running on port ${PORT}`);
// //     });
// //   })
// //   .catch((err) => {
// //     console.error('❌ Failed to sync database:', err.message);
// //   });














// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }

// const express   = require('express');
// const cors      = require('cors');
// const sequelize = require('./config/database');

// require('./models/User');
// require('./models/WeatherReading');

// const authRoutes    = require('./routes/auth');
// const weatherRoutes = require('./routes/weather');
// const notifyRoutes  = require('./routes/notify');

// const app = express();

// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));
// app.options('*', cors());

// app.use(express.json());

// app.get('/', (req, res) => {
//   res.json({ status: 'OK', message: 'Smart Weather Station Backend is running' });
// });

// app.use('/api/auth',    authRoutes);
// app.use('/api/weather', weatherRoutes);
// app.use('/api/notify',  notifyRoutes);

// const PORT = process.env.PORT || 5000;

// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('✅ Database synced');
//     app.listen(PORT, '0.0.0.0', () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Failed to sync database:', err.message);
//   });

















if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express    = require('express');
const cors       = require('cors');
const sequelize  = require('./config/database');

require('./models/User');
require('./models/WeatherReading');

const authRoutes    = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const notifyRoutes  = require('./routes/notify');

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // handle preflight BEFORE routes

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Weather Station Backend is running' });
});

app.use('/api/auth',    authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/notify',  notifyRoutes);

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