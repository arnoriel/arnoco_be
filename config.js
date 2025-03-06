const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'arnoco_db',
  password: 'arnoarno',
  port: 5432,
});

module.exports = pool;