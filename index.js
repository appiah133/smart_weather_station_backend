// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');
// const bcrypt = require('bcrypt');

// const app = express();

// // ================= MIDDLEWARE =================
// app.use(cors());
// app.use(express.json());

// // ================= DATABASE CONFIG =================
// // Render PostgreSQL (production) + local fallback (dev)
// const pool = new Pool(
//   process.env.DATABASE_URL
//     ? {
//         connectionString: process.env.DATABASE_URL,
//         ssl: { rejectUnauthorized: false },
//       }
//     : {
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_NAME,
//         password: process.env.DB_PASSWORD,
//         port: process.env.DB_PORT,
//       }
// );

// // ================= TEST DB CONNECTION =================
// pool.query('SELECT NOW()')
//   .then((res) => {
//     console.log('✅ Database connected at:', res.rows[0].now);
//   })
//   .catch((err) => {
//     console.error('❌ Database connection error:', err.message);
//   });

// // ================= HEALTH CHECK =================
// app.get('/', (req, res) => {
//   res.json({
//     status: 'OK',
//     message: 'Smart Weather Station Backend is running',
//   });
// });

// // ================= AUTH ROUTES =================

// // REGISTER
// app.post('/api/auth/register', async (req, res) => {
//   const { email, password, name } = req.body;

//   try {
//     const userExists = await pool.query(
//       'SELECT id FROM users WHERE email = $1',
//       [email]
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       `INSERT INTO users (email, password, name)
//        VALUES ($1, $2, $3)
//        RETURNING id, email, name`,
//       [email, hashedPassword, name || null]
//     );

//     res.status(201).json({
//       message: 'User registered successfully',
//       user: result.rows[0],
//     });

//   } catch (err) {
//     console.error('❌ Register error:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // LOGIN
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const result = await pool.query(
//       'SELECT * FROM users WHERE email = $1',
//       [email]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const user = result.rows[0];

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     res.json({
//       message: 'Login successful',
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//       },
//       token: `token_${user.id}_${Date.now()}`,
//     });

//   } catch (err) {
//     console.error('❌ Login error:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ================= WEATHER ROUTE =================
// app.get('/api/weather_readings', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT sensor_id, value, timestamp
//       FROM weather_readings
//       ORDER BY timestamp DESC
//     `);

//     res.json(result.rows);

//   } catch (err) {
//     console.error('❌ Weather readings error:', err.message);
//     res.status(500).json({ message: 'Failed to fetch weather readings' });
//   }
// });

// // ================= START SERVER =================
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });








require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DATABASE CONFIG =================
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);

// ================= TEST DB CONNECTION =================
pool.query('SELECT NOW()')
  .then((res) => {
    console.log('✅ Database connected at:', res.rows[0].now);
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
  });

// ================= INIT DB =================
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
  )
`).then(() => console.log('✅ Users table ready'))
  .catch(err => console.error('❌ Table init error:', err.message));

// ================= HEALTH CHECK =================
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Smart Weather Station Backend is running',
  });
});

// ================= AUTH ROUTES =================

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name`,
      [email, hashedPassword, name || null]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });

  } catch (err) {
    console.error('❌ Register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token: `token_${user.id}_${Date.now()}`,
    });

  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= WEATHER ROUTE =================
app.get('/api/weather_readings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sensor_id, value, timestamp
      FROM weather_readings
      ORDER BY timestamp DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error('❌ Weather readings error:', err.message);
    res.status(500).json({ message: 'Failed to fetch weather readings' });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});