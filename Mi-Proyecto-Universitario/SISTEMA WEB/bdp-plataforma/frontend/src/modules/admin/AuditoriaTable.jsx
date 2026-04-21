// frontend/src/modules/admin/AuditoriaTable.jsx
// Tabla de Auditoría — HU-02 (Abygail & Beymar)
// Adaptado al esquema de bdp-plataforma (timestamp_utc, usuario_email, operacion, tabla, hash_actual)
import { useState } from 'react';

const BADGE_CONFIG = {
  LOGIN:    { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  LOGOUT:   { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
  INSERT:   { bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
  UPDATE:   { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
  DELETE:   { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
  EXPORT:   { bg: '#F5F3FF', color: '#5B21B6', border: '#DDD6FE' },
  VIEW:     { bg: '#F0F9FF', color: '#075985', border: '#BAE6FD' },
  ERROR:    { bg: '#FFF1F2', color: '#9F1239', border: '#FECDD3' },
};

const BadgeAccion = ({ accion }) => {
  const cfg = BADGE_CONFIG[accion] || BADGE_CONFIG.VIEW;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
      borderRadius: '20px', fontSize: '11px', fontWeight: '600',
      letterSpacing: '0.04em', background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap',
    }}>
      {accion || '—'}
    </span>
  );
};

const formatFecha = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-BO', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
};

const HashCell = ({ hash }) => {
  const [hover, setHover] = useState(false);
  if (!hash) return <span style={{ color: '#94A3B8' }}>—</span>;
  return (
    <span
      style={{ fontFamily: 'monospace', fontSize: '11px', color: hover ? '#0e2a4b' : '#64748B', cursor: 'pointer', transition: 'color 0.2s' }}
      title={hash}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hash.substring(0, 12)}…
    </span>
  );
};

export default function AuditoriaTable({ logs = [], total = 0, pagina = 1, paginas = 1, onCambiarPagina, cargando = false }) {
  const th = { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap' };
  const td = { padding: '13px 16px', borderBottom: '1px solid #F1F5F9', color: '#334155', fontSize: '13px' };
  const tdMono = { ...td, fontFamily: 'monospace', fontSize: '12px', color: '#475569', whiteSpace: 'nowrap' };

  if (cargando) {
    return (
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '60px', textAlign: 'center', color: '#1db6b4', fontSize: '14px' }}>
        ⏳ Cargando registros...
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #E2E8F0', background: '#FAFAFA' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1A1A2E' }}>Registro de Eventos</h3>
          <span style={{ background: '#dff7f6', color: '#0e2a4b', border: '1px solid #b2ece9', borderRadius: 20, padding: '2px 10px', fontSize: '12px', fontWeight: '600' }}>
            {total.toLocaleString('es-BO')} registros
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', borderRadius: 20, padding: '4px 12px', fontSize: '12px', fontWeight: '600' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
          🔐 WORM Activo
        </div>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              {['#ID', 'Timestamp', 'Usuario', 'IP', 'Operación', 'Tabla', 'ID Reg.', 'Hash'].map(col => (
                <th key={col} style={th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>No se encontraron registros con los filtros aplicados.</td></tr>
            ) : (
              logs.map((log, i) => (
                <tr
                  key={log.id}
                  style={{ background: i % 2 === 0 ? '#fff' : '#FAFBFC', transition: 'background 0.15s', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0fbfb'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFBFC'}
                >
                  <td style={tdMono}>{log.id}</td>
                  <td style={tdMono}>{formatFecha(log.timestamp_utc)}</td>
                  <td style={{ ...td, fontWeight: '500', color: '#1A1A2E' }}>{log.usuario_email}</td>
                  <td style={tdMono}>{log.ip_origen || '—'}</td>
                  <td style={td}><BadgeAccion accion={log.operacion} /></td>
                  <td style={{ ...td, color: '#0e2a4b', fontWeight: '500' }}>{log.tabla}</td>
                  <td style={tdMono}>{log.registro_id || '—'}</td>
                  <td style={td}><HashCell hash={log.hash_actual} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {paginas > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderTop: '1px solid #E2E8F0', background: '#FAFAFA' }}>
          <span style={{ fontSize: '13px', color: '#64748B' }}>Página {pagina} de {paginas}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button disabled={pagina <= 1} onClick={() => onCambiarPagina(pagina - 1)}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#334155', fontSize: '13px', cursor: pagina <= 1 ? 'not-allowed' : 'pointer', opacity: pagina <= 1 ? 0.5 : 1 }}>
              ← Anterior
            </button>
            {Array.from({ length: Math.min(5, paginas) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => onCambiarPagina(p)}
                style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid', fontSize: '13px', cursor: 'pointer', fontWeight: '500', background: p === pagina ? '#0e2a4b' : '#fff', color: p === pagina ? '#fff' : '#334155', borderColor: p === pagina ? '#0e2a4b' : '#E2E8F0' }}>
                {p}
              </button>
            ))}
            <button disabled={pagina >= paginas} onClick={() => onCambiarPagina(pagina + 1)}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#334155', fontSize: '13px', cursor: pagina >= paginas ? 'not-allowed' : 'pointer', opacity: pagina >= paginas ? 0.5 : 1 }}>
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
