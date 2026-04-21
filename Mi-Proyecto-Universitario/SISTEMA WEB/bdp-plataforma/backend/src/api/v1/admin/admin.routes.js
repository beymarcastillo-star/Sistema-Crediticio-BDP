// backend/src/api/v1/admin/admin.routes.js
// Rutas protegidas — solo rol 'administrador'
const express = require('express');
const controller = require('./admin.controller');
const { authenticate, authorize } = require('../../../core/security/auth.middleware');

const router = express.Router();

// Todas las rutas de admin requieren autenticación + rol administrador
router.use(authenticate, authorize('administrador'));

router.post('/invitaciones',  controller.crearInvitacion);
router.get('/invitaciones',   controller.listarInvitaciones);
router.get('/usuarios',       controller.listarUsuarios);

module.exports = router;
