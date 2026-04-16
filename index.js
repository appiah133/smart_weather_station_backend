
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');
// const bcrypt = require('bcrypt');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // PostgreSQL connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// // Test DB connection
// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Database connection error:', err);
//   } else {
//     console.log('Database connected at:', res.rows[0].now);
//   }
// });

// // Root route
// app.get('/', (req, res) => {
//   res.send('Smart Weather Station Backend is running!');
// });


// // ================= AUTH ROUTES =================

// // Register
// app.post('/api/auth/register', async (req, res) => {
//   const { email, password, name } = req.body;

//   try {
//     const userExists = await pool.query(
//       'SELECT * FROM users WHERE email=$1',
//       [email]
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
//       [email, hashedPassword, name || null]
//     );

//     res.status(201).json({
//       message: 'User registered successfully',
//       user: result.rows[0],
//     });

//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const result = await pool.query(
//       'SELECT * FROM users WHERE email=$1',
//       [email]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     const user = result.rows[0];

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Incorrect password' });
//     }

//     res.json({
//       message: 'Login successful',
//       user: { id: user.id, email: user.email },
//       token: `token_${user.id}_${Date.now()}`
//     });

//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// // ================= WEATHER ROUTE FOR FLUTTER =================

// // IMPORTANT: This matches your Flutter WeatherService
// app.get('/api/weather_readings', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT sensor_id, value, timestamp
//       FROM weather_readings
//       ORDER BY timestamp DESC
//     `);

//     // Return ARRAY directly (Flutter expects List<dynamic>)
//     res.json(result.rows);

//   } catch (err) {
//     console.error('Weather readings error:', err);
//     res.status(500).json({ message: 'Failed to fetch weather readings' });
//   }
// });


// // ================= START SERVER =================

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });






















require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected at:', res.rows[0].now);
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Smart Weather Station Backend is running!');
});


// ================= AUTH ROUTES =================

// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name || null]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email },
      token: `token_${user.id}_${Date.now()}`
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ================= WEATHER ROUTE FOR FLUTTER =================

app.get('/api/weather_readings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sensor_id, value, timestamp
      FROM weather_readings
      ORDER BY timestamp DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error('Weather readings error:', err);
    res.status(500).json({ message: 'Failed to fetch weather readings' });
  }
});


// ================= START SERVER =================

// ✅ FIXED: '0.0.0.0' allows connections from phone and other devices on the network
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Access from phone at: http://<YOUR_PC_IP>:${PORT}`);
});