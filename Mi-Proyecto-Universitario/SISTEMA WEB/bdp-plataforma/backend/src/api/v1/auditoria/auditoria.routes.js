// backend/src/api/v1/auditoria/auditoria.routes.js
const express = require('express');
const ctrl    = require('./auditoria.controller');
const { authenticate, authorize } = require('../../../core/security/auth.middleware');

const router = express.Router();

// Solo administrador y auditor pueden ver logs
router.use(authenticate);
router.use(authorize('administrador', 'auditor'));

router.get('/',          ctrl.getLogs);   // GET /api/v1/auditoria
router.get('/verificar', ctrl.verificar); // GET /api/v1/auditoria/verificar

module.exports = router;
