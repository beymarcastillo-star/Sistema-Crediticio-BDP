// backend/src/api/v1/admin/admin.controller.js
// Endpoints exclusivos para el rol administrador
const AuthService = require('../../../modules/auth/auth.service');

/**
 * POST /api/v1/admin/invitaciones
 * Crea una invitación (carnet + código) para un nuevo funcionario.
 */
const crearInvitacion = async (req, res, next) => {
  try {
    const { carnet, nombre, rol } = req.body;

    if (!carnet || !nombre) {
      return res.status(400).json({ error: 'Carnet de identidad y nombre son requeridos' });
    }

    const rolesValidos = ['analista', 'comite', 'auditor', 'administrador'];
    const rolFinal = rolesValidos.includes(rol) ? rol : 'analista';

    const inv = await AuthService.crearInvitacion({
      carnet,
      nombre,
      rol: rolFinal,
      creadoPor: req.user.id,
    });

    res.status(201).json({
      mensaje: 'Invitación creada exitosamente',
      invitacion: {
        id:       inv.id,
        carnet:   inv.carnet,
        codigo:   inv.codigo,
        nombre:   inv.nombre,
        rol:      inv.rol,
        expires_at: inv.expires_at,
      },
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una invitación activa para ese carnet' });
    }
    next(err);
  }
};

/**
 * GET /api/v1/admin/invitaciones
 * Lista todas las invitaciones.
 */
const listarInvitaciones = async (req, res, next) => {
  try {
    const invitaciones = await AuthService.listarInvitaciones();
    res.json({ invitaciones });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/usuarios
 * Lista todos los usuarios del sistema.
 */
const listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await AuthService.listarUsuarios();
    res.json({ usuarios });
  } catch (err) {
    next(err);
  }
};

module.exports = { crearInvitacion, listarInvitaciones, listarUsuarios };
