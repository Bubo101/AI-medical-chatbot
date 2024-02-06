const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use environment variables for your database connection string
  ssl: {
    rejectUnauthorized: false // change to true when in production
  }
});

module.exports = { query: (text, params) => pool.query(text, params) };
