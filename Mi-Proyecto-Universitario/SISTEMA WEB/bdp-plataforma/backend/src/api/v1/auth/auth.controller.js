// backend/src/api/v1/auth/auth.controller.js
const AuthService = require('../../../modules/auth/auth.service');
const db = require('../../../core/database/db');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
    const ipOrigen = req.headers['x-forwarded-for'] || req.ip || '0.0.0.0';
    const result = await AuthService.login(email, password, ipOrigen);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const registro = async (req, res, next) => {
  try {
    const { email, password, nombre, rol } = req.body;
    if (!email || !password || !nombre) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Obtener rol (por defecto: analista)
    const rolNombre = ['administrador','analista','comite','auditor'].includes(rol) ? rol : 'analista';
    const { rows: [rolRow] } = await db.query('SELECT id FROM roles WHERE nombre = $1', [rolNombre]);
    if (!rolRow) return res.status(500).json({ error: 'Rol no encontrado. Ejecuta las migraciones.' });

    const usuario = await AuthService.crearUsuario({ email, password, nombre, rolId: rolRow.id });
    res.status(201).json({ mensaje: 'Cuenta creada correctamente', usuario });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Este email ya está registrado' });
    }
    next(err);
  }
};

const logout = async (req, res) => {
  res.json({ mensaje: 'Sesión cerrada correctamente' });
};

module.exports = { login, registro, logout };
