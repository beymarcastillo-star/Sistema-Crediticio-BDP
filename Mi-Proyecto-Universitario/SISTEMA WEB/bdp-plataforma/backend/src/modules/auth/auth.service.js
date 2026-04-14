// backend/src/modules/auth/auth.service.js
// HU-01: Lógica de negocio de autenticación y gestión de sesiones
const bcrypt = require('bcryptjs');
const db     = require('../../core/database/db');
const config = require('../../core/config');
const { generateToken } = require('../../core/security/jwt');
const AuditoriaService  = require('../auditoria/auditoria.service');

const MAX_INTENTOS = 3;
const BLOQUEO_MINUTOS = 15;

/**
 * Autentica un usuario con email y contraseña.
 * Implementa bloqueo tras MAX_INTENTOS fallidos.
 * Registra cada intento en la auditoría WORM.
 */
const login = async (email, password, ipOrigen) => {
  // 1. Buscar usuario
  const { rows } = await db.query(
    `SELECT u.id, u.email, u.password_hash, u.nombre, u.activo,
            u.intentos_fallidos, u.bloqueado_hasta,
            r.nombre AS rol
     FROM usuarios u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.email = $1`,
    [email]
  );

  const usuario = rows[0];

  // 2. Usuario no existe — respuesta genérica (no revelar si existe o no)
  if (!usuario) {
    await AuditoriaService.log({
      usuarioEmail: email,
      ipOrigen,
      operacion: 'INSERT',
      tabla: 'sesiones',
      registroId: 'LOGIN_FALLIDO',
      datosDespues: { motivo: 'usuario_no_encontrado' },
    });
    throw Object.assign(new Error('Credenciales incorrectas'), { status: 401 });
  }

  // 3. Cuenta bloqueada
  if (usuario.bloqueado_hasta && new Date() < new Date(usuario.bloqueado_hasta)) {
    const minutosRestantes = Math.ceil(
      (new Date(usuario.bloqueado_hasta) - new Date()) / 60000
    );
    throw Object.assign(
      new Error(`Cuenta bloqueada. Intente en ${minutosRestantes} minutos.`),
      { status: 423 }
    );
  }

  // 4. Verificar contraseña
  const passwordValida = await bcrypt.compare(password, usuario.password_hash);

  if (!passwordValida) {
    const intentos = usuario.intentos_fallidos + 1;
    let bloqueo = null;

    if (intentos >= MAX_INTENTOS) {
      bloqueo = new Date(Date.now() + BLOQUEO_MINUTOS * 60 * 1000);
    }

    await db.query(
      'UPDATE usuarios SET intentos_fallidos = $1, bloqueado_hasta = $2 WHERE id = $3',
      [intentos, bloqueo, usuario.id]
    );

    await AuditoriaService.log({
      usuarioEmail: email,
      ipOrigen,
      operacion: 'INSERT',
      tabla: 'sesiones',
      registroId: `LOGIN_FALLIDO_${intentos}`,
      datosDespues: { intentos, bloqueado: !!bloqueo },
    });

    if (intentos >= MAX_INTENTOS) {
      throw Object.assign(
        new Error(`Cuenta bloqueada por ${BLOQUEO_MINUTOS} minutos tras ${MAX_INTENTOS} intentos fallidos.`),
        { status: 423 }
      );
    }

    throw Object.assign(
      new Error(`Credenciales incorrectas. Intentos restantes: ${MAX_INTENTOS - intentos}`),
      { status: 401, intentosRestantes: MAX_INTENTOS - intentos }
    );
  }

  // 5. Login exitoso — resetear contadores
  await db.query(
    'UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL, ultimo_acceso = NOW() WHERE id = $1',
    [usuario.id]
  );

  // 6. Generar JWT
  const token = generateToken({
    id:     usuario.id,
    email:  usuario.email,
    nombre: usuario.nombre,
    rol:    usuario.rol,
  });

  // 7. Registrar sesión
  await AuditoriaService.log({
    usuarioEmail: email,
    ipOrigen,
    operacion: 'INSERT',
    tabla: 'sesiones',
    registroId: `LOGIN_OK_${usuario.id}`,
    datosDespues: { rol: usuario.rol },
  });

  return {
    token,
    usuario: {
      id:     usuario.id,
      email:  usuario.email,
      nombre: usuario.nombre,
      rol:    usuario.rol,
    },
  };
};

/**
 * Crea un nuevo usuario con contraseña hasheada.
 */
const crearUsuario = async ({ email, password, nombre, rolId }) => {
  const hash = await bcrypt.hash(password, config.bcrypt.rounds);
  const { rows } = await db.query(
    `INSERT INTO usuarios (email, password_hash, nombre, rol_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, nombre`,
    [email, hash, nombre, rolId]
  );
  return rows[0];
};

module.exports = { login, crearUsuario };
