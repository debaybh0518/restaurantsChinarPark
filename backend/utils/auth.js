// Placeholder for utility functions (e.g., password hashing, JWT)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  hashPassword: async (password) => bcrypt.hash(password, 10),
  comparePassword: async (password, hash) => bcrypt.compare(password, hash),
  generateJWT: (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }),
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
};