const pool = require('../config/db');

async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

module.exports = {
  getUserByEmail
};
