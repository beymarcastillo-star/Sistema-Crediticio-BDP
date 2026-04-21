// frontend/src/modules/admin/AdminView.jsx
// ============================================================
// TAREAS PENDIENTES — AdminView.jsx
// ── P2 🟣 Beymar · HU-02 (Roles y Permisos) ─────────────────
// TODO (P2 · Beymar · HU-02): Toggles de matriz de permisos deben cambiar estado al hacer clic
// TODO (P2 · Beymar · HU-02): Modal de confirmación al cambiar un permiso
// ── P3 🟠 Norma · HU-12 (Motor de Reglas) ───────────────────
// TODO (P3 · Norma · HU-12): Botón "Guardar cambios" con spinner → "Guardado ✓" tras 2s
// TODO (P3 · Norma · HU-12): Botón "Restaurar por defecto" con modal de confirmación
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import AuditoriaView from './AuditoriaView.jsx';
import { api } from '../../services/api.js';
import DevTaskPanel from '../../components/DevTaskPanel.jsx';

// ── Gestión de Usuarios ─────────────────────────────────────────
function GestionUsuariosView() {
  const [usuarios,      setUsuarios]      = useState([]);
  const [invitaciones,  setInvitaciones]  = useState([]);
  const [cargando,      setCargando]      = useState(true);
  const [subtab,        setSubtab]        = useState('usuarios');
  // Formulario nueva invitación
  const [form,    setForm]    = useState({ carnet: '', nombre: '', rol: 'analista' });
  const [saving,  setSaving]  = useState(false);
  const [nueva,   setNueva]   = useState(null);  // invitación recién creada (mostrar código)
  const [msg,     setMsg]     = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [u, i] = await Promise.all([
        api.admin.listarUsuarios(),
        api.admin.listarInvitaciones(),
      ]);
      setUsuarios(u.usuarios || []);
      setInvitaciones(i.invitaciones || []);
    } catch {
      // backend no disponible — mostrar placeholders
    } finally { setCargando(false); }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleCrearInvitacion = async (e) => {
    e.preventDefault();
    if (!form.carnet.trim() || !form.nombre.trim())
      return setMsg('El carnet y el nombre son obligatorios.');
    setSaving(true); setMsg('');
    try {
      const data = await api.admin.crearInvitacion(form);
      setNueva(data.invitacion);
      setForm({ carnet: '', nombre: '', rol: 'analista' });
      cargar();
    } catch (err) {
      setMsg(err.message || 'Error al crear invitación');
    } finally { setSaving(false); }
  };

  const ROL_COLOR = { administrador: '#dc2626', analista: '#0369a1', comite: '#7c3aed', auditor: '#059669' };

  const inp = {
    padding: '9px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB',
    background: '#fff', color: '#0e2a4b', fontSize: 13, outline: 'none',
    fontFamily: 'inherit', width: '100%',
  };
  const btnP = {
    padding: '10px 22px', borderRadius: 8, border: 'none',
    background: 'linear-gradient(135deg, #0e2a4b, #123d6b)', color: '#fff',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  };

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['usuarios','👥 Usuarios'],['invitaciones','🎫 Invitaciones'],['nueva','➕ Nueva Invitación']].map(([k, l]) => (
          <div key={k} onClick={() => { setSubtab(k); setNueva(null); setMsg(''); }}
            style={{ padding: '8px 18px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: subtab === k ? '#0e2a4b' : '#f1f5f9',
              color: subtab === k ? '#fff' : '#475569' }}>
            {l}
          </div>
        ))}
      </div>

      {/* ── LISTA USUARIOS ── */}
      {subtab === 'usuarios' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Usuarios del Sistema</div>
            <span className="badge b-blue">{usuarios.length} registrados</span>
          </div>
          <div className="card-body p0">
            {cargando ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Cargando...</div>
            ) : usuarios.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No hay usuarios o backend no disponible</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['#','Nombre','CI','Email','Rol','Estado','Desde'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u, i) => (
                    <tr key={u.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={{ padding: '11px 14px', color: '#94a3b8', fontFamily: 'monospace', fontSize: 12 }}>{u.id}</td>
                      <td style={{ padding: '11px 14px', fontWeight: 600, color: '#1a1a2e' }}>{u.nombre}</td>
                      <td style={{ padding: '11px 14px', fontFamily: 'monospace', color: '#475569' }}>{u.carnet_identidad || '—'}</td>
                      <td style={{ padding: '11px 14px', color: '#475569' }}>{u.email}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${ROL_COLOR[u.rol] || '#6b7280'}18`, color: ROL_COLOR[u.rol] || '#6b7280', border: `1px solid ${ROL_COLOR[u.rol] || '#6b7280'}40` }}>
                          {u.rol}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: u.activo ? '#059669' : '#dc2626' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.activo ? '#059669' : '#dc2626', display: 'inline-block' }} />
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: '#94a3b8' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('es-BO') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── LISTA INVITACIONES ── */}
      {subtab === 'invitaciones' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Invitaciones Emitidas</div>
            <span className="badge b-blue">{invitaciones.length} total</span>
          </div>
          <div className="card-body p0">
            {cargando ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Cargando...</div>
            ) : invitaciones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No hay invitaciones creadas</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['CI','Nombre','Rol','Código','Estado','Vence','Creada por'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invitaciones.map((inv, i) => (
                    <tr key={inv.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={{ padding: '11px 14px', fontFamily: 'monospace', color: '#0e2a4b', fontWeight: 600 }}>{inv.carnet}</td>
                      <td style={{ padding: '11px 14px', color: '#334155' }}>{inv.nombre}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${ROL_COLOR[inv.rol] || '#6b7280'}18`, color: ROL_COLOR[inv.rol] || '#6b7280', border: `1px solid ${ROL_COLOR[inv.rol] || '#6b7280'}40` }}>
                          {inv.rol}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: 14, fontWeight: 700, letterSpacing: '0.15em', color: inv.usado ? '#94a3b8' : '#0e2a4b' }}>
                        {inv.usado ? '— usado —' : inv.codigo}
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: inv.usado ? '#94a3b8' : new Date(inv.expires_at) > new Date() ? '#059669' : '#dc2626' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: inv.usado ? '#94a3b8' : new Date(inv.expires_at) > new Date() ? '#059669' : '#dc2626', display: 'inline-block' }} />
                          {inv.usado ? 'Utilizada' : new Date(inv.expires_at) > new Date() ? 'Pendiente' : 'Vencida'}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: '#94a3b8' }}>
                        {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString('es-BO') : '—'}
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: '#64748b' }}>{inv.creado_por_nombre || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── FORMULARIO NUEVA INVITACIÓN ── */}
      {subtab === 'nueva' && (
        <div className="card" style={{ maxWidth: 560 }}>
          <div className="card-header">
            <div className="card-title">Generar Código de Invitación</div>
            <span className="badge b-green">Solo Admin</span>
          </div>
          <div className="card-body">
            <div className="info-box" style={{ marginBottom: 18, fontSize: 12 }}>
              El sistema generará un <strong>código único de 8 caracteres</strong> vinculado al CI del funcionario.
              Comparte el CI y el código con el funcionario para que pueda registrarse. El código expira en <strong>7 días</strong>.
            </div>

            {/* Código recién generado */}
            {nueva && (
              <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: 12, padding: '20px 24px', marginBottom: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#15803d', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>✅ Invitación creada exitosamente</div>
                <div style={{ fontSize: 13, color: '#374151', marginBottom: 12 }}>
                  <strong>{nueva.nombre}</strong> · CI: <code style={{ background: '#e0f2fe', padding: '2px 8px', borderRadius: 6 }}>{nueva.carnet}</code>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.3em', color: '#0e2a4b', background: '#dff7f6', border: '2px dashed #1db6b4', borderRadius: 10, padding: '14px 24px', display: 'inline-block' }}>
                  {nueva.codigo}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 10 }}>
                  Vence: {nueva.expires_at ? new Date(nueva.expires_at).toLocaleDateString('es-BO') : '7 días'}
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: '#dc2626', fontWeight: 600 }}>
                  ⚠ Comparte este código de forma segura — solo se muestra una vez en pantalla.
                </div>
              </div>
            )}

            {msg && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 14 }}>{msg}</div>
            )}

            <form onSubmit={handleCrearInvitacion} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Carnet de Identidad (CI)</label>
                <input style={inp} placeholder="Ej: 7654321" value={form.carnet} onChange={e => setForm(f => ({ ...f, carnet: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Nombre Completo del Funcionario</label>
                <input style={inp} placeholder="Ej: María Ávila López" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Rol a Asignar</label>
                <select style={inp} value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}>
                  <option value="analista">Analista Crédito</option>
                  <option value="comite">Comité Crédito</option>
                  <option value="auditor">Auditor Interno</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="submit" disabled={saving} style={btnP}>
                  {saving ? '⏳ Generando...' : '🎫 Generar Invitación'}
                </button>
                <button type="button" onClick={() => { setForm({ carnet: '', nombre: '', rol: 'analista' }); setNueva(null); setMsg(''); }}
                  style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'transparent', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>
                  Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminView() {
  const [tab, setTab] = useState('usuarios');

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
        {[['usuarios','👥 Gestión de Usuarios'],['permisos','🔐 Gestor de Permisos'],['auditoria','🔍 Visor de Auditoría'],['motor','⚙ Motor de Reglas']].map(([key, label]) => (
          <div key={key} className={`tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>{label}</div>
        ))}
      </div>

      {/* GESTIÓN DE USUARIOS */}
      {tab === 'usuarios' && <GestionUsuariosView />}

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

      {/* AUDITORÍA — HU-02 Abygail & Beymar integrado */}
      {tab === 'auditoria' && <AuditoriaView />}

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
      <DevTaskPanel vista="Admin" />
    </div>
  );
}
