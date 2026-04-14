// backend/src/modules/auditoria/auditoria.service.js
// HU-02: Logs WORM (Write Once Read Many) con hash encadenado
// Implementación real del sistema de auditoría bancaria
const crypto = require('crypto');
const db     = require('../../core/database/db');

/** Obtiene el hash del último registro para encadenamiento */
const getUltimoHash = async () => {
  const { rows } = await db.query(
    'SELECT hash_actual FROM auditoria ORDER BY id DESC LIMIT 1'
  );
  return rows[0]?.hash_actual || '0000000000000000000000000000000000000000000000000000000000000000';
};

/** Genera SHA-256 del contenido del log encadenado con el hash anterior */
const calcularHash = (entrada) => {
  return crypto.createHash('sha256').update(JSON.stringify(entrada)).digest('hex');
};

/**
 * Registra una operación en el log WORM.
 * Los logs son INMUTABLES — no se pueden modificar ni eliminar.
 *
 * @param {object} params
 * @param {string} params.usuarioEmail
 * @param {string} params.ipOrigen
 * @param {string} params.operacion   — INSERT | UPDATE | DELETE | SELECT
 * @param {string} params.tabla
 * @param {string} params.registroId
 * @param {object} [params.datosAntes]
 * @param {object} [params.datosDespues]
 * @param {string} [params.sesionToken]
 */
const log = async ({
  usuarioEmail,
  ipOrigen,
  operacion,
  tabla,
  registroId,
  datosAntes    = null,
  datosDespues  = null,
  sesionToken   = null,
}) => {
  const hashAnterior = await getUltimoHash();
  const timestampUtc = new Date().toISOString();

  const hashActual = calcularHash({
    timestampUtc,
    usuarioEmail,
    ipOrigen,
    operacion,
    tabla,
    registroId,
    datosAntes,
    datosDespues,
    hashAnterior,
  });

  await db.query(
    `INSERT INTO auditoria
      (timestamp_utc, usuario_email, ip_origen, operacion, tabla, registro_id,
       datos_antes, datos_despues, hash_anterior, hash_actual, sesion_token)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      timestampUtc,
      usuarioEmail,
      ipOrigen || '0.0.0.0',
      operacion,
      tabla,
      registroId,
      datosAntes    ? JSON.stringify(datosAntes)    : null,
      datosDespues  ? JSON.stringify(datosDespues)  : null,
      hashAnterior,
      hashActual,
      sesionToken,
    ]
  );

  return hashActual;
};

/**
 * Obtiene el log de auditoría con paginación y filtros.
 * Solo lectura — cumple RF-06.
 */
const getLogs = async ({
  pagina    = 1,
  limite    = 50,
  operacion = null,
  tabla     = null,
  usuario   = null,
  desde     = null,
  hasta     = null,
} = {}) => {
  const offset = (pagina - 1) * limite;
  const params = [];
  const wheres = [];

  if (operacion) { params.push(operacion); wheres.push(`operacion = $${params.length}`); }
  if (tabla)     { params.push(tabla);     wheres.push(`tabla = $${params.length}`); }
  if (usuario)   { params.push(`%${usuario}%`); wheres.push(`usuario_email ILIKE $${params.length}`); }
  if (desde)     { params.push(desde);    wheres.push(`timestamp_utc >= $${params.length}`); }
  if (hasta)     { params.push(hasta);    wheres.push(`timestamp_utc <= $${params.length}`); }

  const where = wheres.length ? `WHERE ${wheres.join(' AND ')}` : '';

  params.push(limite); const limitParam  = params.length;
  params.push(offset); const offsetParam = params.length;

  const { rows } = await db.query(
    `SELECT id, timestamp_utc, usuario_email, ip_origen,
            operacion, tabla, registro_id, hash_actual
     FROM auditoria
     ${where}
     ORDER BY id DESC
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    params
  );

  const { rows: countRows } = await db.query(
    `SELECT COUNT(*) AS total FROM auditoria ${where}`,
    params.slice(0, params.length - 2)
  );

  return {
    logs:  rows,
    total: parseInt(countRows[0].total, 10),
    pagina,
    limite,
  };
};

/**
 * Verifica la integridad del log recomputando los hashes.
 * Detecta cualquier manipulación de registros.
 */
const verificarIntegridad = async () => {
  const { rows } = await db.query(
    'SELECT * FROM auditoria ORDER BY id ASC'
  );

  const errores = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const hashEsperado = calcularHash({
      timestampUtc:  r.timestamp_utc,
      usuarioEmail:  r.usuario_email,
      ipOrigen:      r.ip_origen,
      operacion:     r.operacion,
      tabla:         r.tabla,
      registroId:    r.registro_id,
      datosAntes:    r.datos_antes,
      datosDespues:  r.datos_despues,
      hashAnterior:  r.hash_anterior,
    });

    if (hashEsperado !== r.hash_actual) {
      errores.push({ id: r.id, esperado: hashEsperado, actual: r.hash_actual });
    }
  }

  return { integro: errores.length === 0, errores };
};

module.exports = { log, getLogs, verificarIntegridad };
