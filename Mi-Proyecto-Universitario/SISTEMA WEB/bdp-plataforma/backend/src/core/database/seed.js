// backend/src/core/database/seed.js
// Ejecutar: npm run seed
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const bcrypt = require('bcryptjs');
const db     = require('./db');

const ROUNDS = 12;

const usuarios = [
  { email: 'analista@bdp.bo',  password: 'password',  nombre: 'María Ávila',    rol: 'analista' },
  { email: 'admin@bdp.bo',     password: 'admin123',   nombre: 'Carlos Mamani',  rol: 'administrador' },
  { email: 'comite@bdp.bo',    password: 'comite123',  nombre: 'Roberto Flores', rol: 'comite' },
  { email: 'auditoria@bdp.bo', password: 'audit123',   nombre: 'Laura Arias',    rol: 'auditor' },
];

async function seed() {
  console.log('🌱 Iniciando seed...');

  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.password, ROUNDS);
    const { rows: [rol] } = await db.query('SELECT id FROM roles WHERE nombre = $1', [u.rol]);
    if (!rol) { console.warn(`⚠ Rol "${u.rol}" no encontrado. Ejecuta migrations.sql primero.`); continue; }

    await db.query(`
      INSERT INTO usuarios (email, password_hash, nombre, rol_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE
        SET password_hash = EXCLUDED.password_hash,
            nombre        = EXCLUDED.nombre
    `, [u.email, hash, u.nombre, rol.id]);

    console.log(`  ✓ ${u.email} (${u.rol})`);
  }

  console.log('✅ Seed completado');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error en seed:', err.message);
  process.exit(1);
});
