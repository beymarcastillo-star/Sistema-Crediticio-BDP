// backend/src/server.js
'use strict';
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const config   = require('./core/config');
const errorHandler = require('./core/middleware/error.handler');

const authRoutes      = require('./api/v1/auth/auth.routes');
const auditoriaRoutes = require('./api/v1/auditoria/auditoria.routes');
const adminRoutes     = require('./api/v1/admin/admin.routes');

const app = express();

// Seguridad
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', env: config.env }));

// Rutas
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/auditoria', auditoriaRoutes);
app.use('/api/v1/admin',     adminRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: `${req.method} ${req.path} no encontrado` }));

// Errores
app.use(errorHandler);

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`🚀 BDP Backend corriendo en http://localhost:${config.port}`);
    console.log(`   Entorno: ${config.env}`);
  });
}

module.exports = app;
