const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false,
  max: 5,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  end:   () => pool.end(),
};
