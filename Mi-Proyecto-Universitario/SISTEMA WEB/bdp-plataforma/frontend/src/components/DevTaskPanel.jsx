// DevTaskPanel — Panel de tareas pendientes (solo visible en DEV)
import { useState } from 'react';
import { TAREAS_POR_VISTA, PAREJAS } from '../TAREAS.js';

export default function DevTaskPanel({ vista }) {
  if (!import.meta.env.DEV) return null;

  const tareas = TAREAS_POR_VISTA[vista] || [];
  if (tareas.length === 0) return null;

  const porPareja = tareas.reduce((acc, t) => {
    if (!acc[t.pareja]) acc[t.pareja] = [];
    acc[t.pareja].push(t);
    return acc;
  }, {});

  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 6,
      maxWidth: 360, fontFamily: 'monospace',
    }}>
      {Object.entries(porPareja).map(([key, items]) => (
        <ParejaPanel key={key} parejaKey={key} items={items} />
      ))}
    </div>
  );
}

function ParejaPanel({ parejaKey, items }) {
  const [open, setOpen] = useState(false);
  const p = PAREJAS[parejaKey];
  const pendientes = items.filter(t => t.estado === 'pendiente').length;
  const enProgreso = items.filter(t => t.estado === 'progreso').length;
  const listos = items.filter(t => t.estado === 'listo').length;

  return (
    <div style={{
      background: p.bg, border: `2px solid ${p.border}`,
      borderRadius: 10, overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '8px 12px', border: 'none', cursor: 'pointer',
          background: p.color, color: '#fff', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
        }}
      >
        <span>{p.nombre}</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {pendientes > 0 && <span style={badgeStyle('#FEF3C7','#92400E')}>{pendientes} ⏳</span>}
          {enProgreso > 0 && <span style={badgeStyle('#DBEAFE','#1E40AF')}>{enProgreso} 🔄</span>}
          {listos > 0 && <span style={badgeStyle('#D1FAE5','#065F46')}>{listos} ✓</span>}
          <span style={{ fontSize: 10 }}>{open ? '▲' : '▼'}</span>
        </span>
      </button>

      {open && (
        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((t, i) => (
            <div key={i} style={{
              display: 'flex', gap: 6, alignItems: 'flex-start',
              opacity: t.estado === 'listo' ? 0.5 : 1,
            }}>
              <span style={{ fontSize: 13, minWidth: 16 }}>
                {t.estado === 'listo' ? '✅' : t.estado === 'progreso' ? '🔄' : '⬜'}
              </span>
              <div style={{ fontSize: 11, lineHeight: 1.4 }}>
                <span style={{
                  background: p.color, color: '#fff',
                  borderRadius: 3, padding: '1px 4px', fontSize: 10,
                  marginRight: 4, fontWeight: 700,
                }}>
                  {t.hu}
                </span>
                <span style={{ textDecoration: t.estado === 'listo' ? 'line-through' : 'none', color: '#374151' }}>
                  {t.tarea}
                </span>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 4, fontSize: 10, color: '#6B7280', borderTop: `1px solid ${p.border}`, paddingTop: 4 }}>
            Para marcar como listo: cambiar estado a 'listo' en TAREAS.js
          </div>
        </div>
      )}
    </div>
  );
}

function badgeStyle(bg, color) {
  return {
    background: bg, color, borderRadius: 4,
    padding: '1px 5px', fontSize: 10, fontWeight: 700,
  };
}
