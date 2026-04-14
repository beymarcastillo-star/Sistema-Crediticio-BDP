// backend/src/core/security/jwt.js
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

const generateToken = (payload) => {
  return jwt.sign(
    { ...payload, jti: uuidv4() },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn, issuer: 'bdp-creditos' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret, { issuer: 'bdp-creditos' });
};

module.exports = { generateToken, verifyToken };
