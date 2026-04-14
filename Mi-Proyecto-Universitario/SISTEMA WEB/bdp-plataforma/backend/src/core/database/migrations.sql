-- BDP Plataforma Crediticia — Esquema base de datos
-- Solo las tablas necesarias para auth y auditoria

CREATE TABLE IF NOT EXISTS roles (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (nombre) VALUES
  ('administrador'), ('analista'), ('comite'), ('auditor')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS usuarios (
  id                SERIAL PRIMARY KEY,
  email             VARCHAR(120) UNIQUE NOT NULL,
  password_hash     TEXT NOT NULL,
  nombre            VARCHAR(100) NOT NULL,
  rol_id            INTEGER REFERENCES roles(id),
  activo            BOOLEAN DEFAULT TRUE,
  intentos_fallidos INTEGER DEFAULT 0,
  bloqueado_hasta   TIMESTAMPTZ,
  ultimo_acceso     TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auditoria (
  id            BIGSERIAL PRIMARY KEY,
  timestamp_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  usuario_email VARCHAR(120),
  ip_origen     VARCHAR(45),
  operacion     VARCHAR(10) NOT NULL CHECK (operacion IN ('INSERT','UPDATE','DELETE','SELECT')),
  tabla         VARCHAR(60) NOT NULL,
  registro_id   VARCHAR(100),
  datos_antes   TEXT,
  datos_despues TEXT,
  hash_anterior CHAR(64) NOT NULL,
  hash_actual   CHAR(64) NOT NULL,
  sesion_token  TEXT
);

CREATE INDEX IF NOT EXISTS idx_auditoria_timestamp ON auditoria(timestamp_utc DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario   ON auditoria(usuario_email);
