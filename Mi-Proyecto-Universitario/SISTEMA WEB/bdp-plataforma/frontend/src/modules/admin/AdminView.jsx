// frontend/src/modules/admin/AdminView.jsx
import { useState, useEffect } from 'react';
import { api } from '../../services/api.js';

export default function AdminView() {
  const [tab, setTab] = useState('permisos');
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'auditoria') cargarLogs();
  }, [tab]);

  const cargarLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getLogs({ pagina: 1, limite: 50 });
      setLogs(data.logs);
      setTotal(data.total);
    } catch (e) {
      console.error('Error cargando logs:', e);
    } finally {
      setLoading(false);
    }
  };

  const opClass = (op) => {
    if (op === 'INSERT') return 'op-ins';
    if (op === 'UPDATE') return 'op-upd';
    if (op === 'DELETE') return 'op-del';
    return '';
  };

  const Toggle = ({ on = false }) => {
    const [active, setActive] = useState(on);
    return (
      <div className="toggle-wrap" onClick={() => setActive(!active)}>
        <div className={`toggle-track${active ? ' on' : ''}`}><div className="toggle-knob"></div></div>
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Panel de Administración</div>
          <div className="page-sub">Back Office · Permisos, Auditoría &amp; Motor de Reglas</div>
        </div>
      </div>

      <div className="tabs">
        {[['permisos','🔐 Gestor de Permisos'],['auditoria','🔍 Visor de Auditoría'],['motor','⚙ Motor de Reglas']].map(([key, label]) => (
          <div key={key} className={`tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>{label}</div>
        ))}
      </div>

      {/* PERMISOS */}
      {tab === 'permisos' && (
        <div className="g21">
          <div className="card">
            <div className="card-header"><div className="card-title">Matriz de Permisos por Rol</div><span className="badge b-blue">RF-07</span></div>
            <div className="card-body p0">
              <div className="perm-row hdr"><div>Módulo</div><div className="perm-col">Admin</div><div className="perm-col">Analista</div><div className="perm-col">Comité</div><div className="perm-col">Auditor</div><div className="perm-col">Vista</div></div>
              {[
                { name: '📋 Solicitudes',      perms: [true, true, true, false, true] },
                { name: '🧮 Evaluación Fin.',  perms: [true, true, false, false, false] },
                { name: '📈 Riesgo & Score',   perms: [true, true, true, false, true] },
                { name: '🔍 Auditoría/Logs',   perms: [true, false, false, true, false] },
                { name: '⚙ Motor de Reglas',   perms: [true, false, false, false, false] },
              ].map((row, i) => (
                <div key={i} className="perm-row">
                  <div>{row.name}</div>
                  {row.perms.map((on, j) => <div key={j} className="perm-col"><Toggle on={on} /></div>)}
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Usuarios del Sistema</div></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { ini: 'MA', cls: '', name: 'María Ávila', role: 'Analista Crédito', online: true },
                { ini: 'RF', cls: 'green', name: 'Roberto Flores', role: 'Analista Senior' },
                { ini: 'CM', cls: 'orange', name: 'Carlos Mamani', role: 'Comité Crédito' },
                { ini: 'LA', cls: 'purple', name: 'Laura Arias', role: 'Auditora Interna' },
              ].map((u, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className={`avatar ${u.cls}`}>{u.ini}</div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.role}</div></div>
                  {u.online && <div className="online"></div>}
                </div>
              ))}
              <div className="info-box" style={{ marginTop: 8, fontSize: 11 }}><strong>RNF-02:</strong> La plataforma soporta hasta <strong>500 usuarios concurrentes</strong>.</div>
            </div>
          </div>
        </div>
      )}

      {/* AUDITORÍA */}
      {tab === 'auditoria' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Registro de Auditoría — Solo Lectura</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input className="inp" placeholder="🔍 Filtrar por usuario..." style={{ width: 260, padding: '8px 12px' }} />
              <span className="badge b-green" style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{total} entradas</span>
            </div>
          </div>
          <div className="card-body p0">
            <div className="alert a-info" style={{ margin: '16px 16px 0', borderRadius: 8 }}>
              <div className="alert-ico">🔒</div>
              <div className="alert-text"><strong>RF-06 — Logs inmutables:</strong> Hash encadenado SHA-256 garantiza integridad total.</div>
            </div>
            <div className="tbl-wrap" style={{ marginTop: 12 }}>
              <table className="log-tbl">
                <thead><tr><th>Timestamp</th><th>Usuario</th><th>IP</th><th>Operación</th><th>Tabla</th><th>ID Registro</th><th>Hash</th></tr></thead>
                <tbody>
                  {loading && <tr><td colSpan="7" style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Cargando logs...</td></tr>}
                  {!loading && logs.length === 0 && (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>No hay registros aún</td></tr>
                  )}
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td>{new Date(log.timestamp_utc).toLocaleString('es-BO')}</td>
                      <td>{log.usuario_email}</td>
                      <td>{log.ip_origen}</td>
                      <td><span className={opClass(log.operacion)}>{log.operacion}</span></td>
                      <td>{log.tabla}</td>
                      <td>{log.registro_id}</td>
                      <td style={{ color: 'var(--gray-400)' }}>{log.hash_actual?.slice(0, 12)}…</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MOTOR DE REGLAS */}
      {tab === 'motor' && (
        <div>
          <div className="alert a-info mb20"><div className="alert-ico">⚙</div><div className="alert-text"><strong>RNF-03 — Motor de Reglas:</strong> El administrador puede ajustar tasas y validaciones <strong>sin reprogramar</strong>.</div></div>
          {[
            { title: '📊 Reglas de Calificación Crediticia', fields: [['Score mínimo aprobación', '600'], ['Score máximo riesgo alto', '500'], ['Peso variable financiera (%)', '40']] },
            { title: '💰 Parámetros de Tasas y Plazos', fields: [['Tasa mínima Pyme (%)', '4.5'], ['Tasa máxima Pyme (%)', '9.0'], ['Plazo máximo (meses)', '120']] },
            { title: '🌾 Supuestos Agrícolas por Defecto', fields: [['Precio ref. quintal soya (Bs.)', '295'], ['Factor descuento sequía (%)', '30'], ['Cobertura garantía mínima (%)', '150']] },
            { title: '🐄 Parámetros Ciclo Pecuario', fields: [['Natalidad hato estimada (%)', '65'], ['Mortalidad proyectada (%)', '5'], ['Precio kg. ganado en pie (Bs.)', '18.5']] },
          ].map((rule, i) => (
            <div key={i} className="rule-card">
              <div className="rule-header"><div className="rule-name">{rule.title}</div><span className="badge b-green">Activa</span></div>
              <div className="rule-inputs">
                {rule.fields.map(([label, val], j) => (
                  <div key={j} className="rule-field"><div className="rule-lbl">{label}</div><input className="rule-inp" defaultValue={val} /></div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button className="btn btn-outline">Restaurar valores por defecto</button>
            <button className="btn btn-primary">💾 Guardar cambios</button>
          </div>
        </div>
      )}
    </div>
  );
}
