// backend/src/core/config/index.js
require('dotenv').config();

module.exports = {
  env:  process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,

  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME     || 'bdp_creditos',
    user:     process.env.DB_USER     || 'bdp_user',
    password: process.env.DB_PASSWORD || 'bdp_password',
    max: 20,
    idleTimeoutMillis:       30000,
    connectionTimeoutMillis: 2000,
  },

  jwt: {
    secret:    process.env.JWT_SECRET     || 'bdp-dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },

  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
  },
};
