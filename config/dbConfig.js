const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  database: 'tracker',
  port: process.env.DB_PORT || 3001,
});

module.exports = pool;
