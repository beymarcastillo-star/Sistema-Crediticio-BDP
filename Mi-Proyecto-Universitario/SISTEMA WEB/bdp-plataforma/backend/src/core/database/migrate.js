// backend/src/core/database/migrate.js
// Ejecutar: npm run migrate
// Aplica cambios de esquema sin borrar datos existentes
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const db = require('./db');

const migraciones = [
  {
    nombre: 'Añadir carnet_identidad y cargo a usuarios',
    sql: `
      ALTER TABLE usuarios
        ADD COLUMN IF NOT EXISTS carnet_identidad VARCHAR(20) UNIQUE,
        ADD COLUMN IF NOT EXISTS cargo VARCHAR(100);
    `,
  },
  {
    nombre: 'Crear tabla invitaciones',
    sql: `
      CREATE TABLE IF NOT EXISTS invitaciones (
        id          SERIAL PRIMARY KEY,
        carnet      VARCHAR(20) NOT NULL,
        codigo      CHAR(8) NOT NULL,
        nombre      VARCHAR(100) NOT NULL,
        rol         VARCHAR(50) NOT NULL DEFAULT 'analista',
        usado       BOOLEAN DEFAULT FALSE,
        creado_por  INTEGER REFERENCES usuarios(id),
        expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(carnet, codigo)
      );
    `,
  },
  {
    nombre: 'Índices en invitaciones',
    sql: `
      CREATE INDEX IF NOT EXISTS idx_invitaciones_carnet ON invitaciones(carnet);
      CREATE INDEX IF NOT EXISTS idx_invitaciones_codigo ON invitaciones(codigo);
    `,
  },
];

async function migrate() {
  console.log('🔄 Aplicando migraciones...\n');
  for (const m of migraciones) {
    try {
      await db.query(m.sql);
      console.log(`  ✓ ${m.nombre}`);
    } catch (err) {
      console.error(`  ✗ ${m.nombre}: ${err.message}`);
      process.exit(1);
    }
  }
  console.log('\n✅ Migraciones completadas');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});
