// backend/src/api/v1/auth/auth.routes.js
const express    = require('express');
const rateLimit  = require('express-rate-limit');
const controller = require('./auth.controller');
const { authenticate } = require('../../../core/security/auth.middleware');

const router = express.Router();

// Máximo 10 intentos de login por IP en 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos. Intente en 15 minutos.' },
});

router.post('/login',    loginLimiter, controller.login);
router.post('/registro', loginLimiter, controller.registro);
router.post('/logout',   authenticate, controller.logout);

module.exports = router;
