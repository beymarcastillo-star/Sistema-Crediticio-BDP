// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { api } from './services/api.js';

// ============================================================
// TAREAS PENDIENTES — App.jsx (Login + Layout general)
// ── P1 🔵 Roger · HU-01 (Autenticación) ─────────────────────
// TODO (P1 · Roger · HU-01): Agregar link "¿Olvidaste tu contraseña?" bajo el botón login
// TODO (P1 · Roger · HU-01): Reemplazar mensaje texto plano por toast con color (rojo/verde/amarillo)
// TODO (P1 · Roger · HU-01): Mostrar estado bloqueado tras 3 intentos fallidos con cuenta regresiva
// ── P1 🔵 Roger · HU-10 (Operación Offline) ─────────────────
// TODO (P1 · Roger · HU-10): Chip online/offline en topbar usando navigator.onLine
// TODO (P1 · Roger · HU-10): Banner amarillo "Modo sin conexión" cuando se pierda la red
// TODO (P1 · Roger · HU-10): Banner verde temporal "Conexión restaurada" al volver online
// ── P2 🟣 Beymar · HU-11 (Monitoreo) ────────────────────────
// TODO (P2 · Beymar · HU-11): Panel de notificaciones al clic en 🔔 (drawer con lista mock)
// TODO (P2 · Beymar · HU-11): Badge con contador en ícono 🔔
// TODO (P2 · Beymar · HU-11): Aviso sesión por vencer: banner "Tu sesión expira en 5 min"
// ============================================================
import DevTaskPanel       from './components/DevTaskPanel.jsx';
import DashboardView      from './modules/dashboard/DashboardView.jsx';
import SolicitudesView    from './modules/creditos/SolicitudesView.jsx';
import NuevaSolicitudView from './modules/creditos/NuevaSolicitudView.jsx';
import EvaluacionView     from './modules/creditos/EvaluacionView.jsx';
import RiesgoView         from './modules/creditos/RiesgoView.jsx';
import GarantiasView      from './modules/creditos/GarantiasView.jsx';
import AdminView          from './modules/admin/AdminView.jsx';
import ReportesView       from './modules/reportes/ReportesView.jsx';

/* ─── LOGIN — Diseño del compañero (glassmorphism + slider) ── */
const LOGIN_SLIDES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80', // campo agrícola
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80', // reunión empresarial
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',    // manufactura/textil
];

function LoginScreen({ onLogin }) {
  const [modo, setModo]           = useState('login');
  const [slideIdx, setSlideIdx]   = useState(0);
  // Login
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  // Registro
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail]   = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRol, setRegRol]       = useState('analista');
  // Compartido
  const [msg, setMsg]       = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Slider automático
  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % LOGIN_SLIDES.length), 3000);
    return () => clearInterval(t);
  }, []);

  const cambiarModo = (m) => { setModo(m); setMsg({ text: '', type: '' }); };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const doLogin = async (e) => {
    e.preventDefault();
    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm || !password) return setMsg({ text: 'Por favor, completa todos los campos.', type: 'warning' });
    if (!emailRegex.test(emailNorm)) return setMsg({ text: 'Ingresa un correo electrónico válido.', type: 'warning' });
    if (password.length < 6) return setMsg({ text: 'La contraseña debe tener al menos 6 caracteres.', type: 'warning' });
    setLoading(true); setMsg({ text: 'Validando acceso...', type: 'warning' });
    try {
      const data = await api.login(emailNorm, password);
      sessionStorage.setItem('bdp_token', data.token);
      sessionStorage.setItem('bdp_user', JSON.stringify(data.usuario));
      onLogin(data.usuario);
    } catch (err) {
      setMsg({ text: err.message || 'Credenciales incorrectas', type: 'error' });
    } finally { setLoading(false); }
  };

  const doRegistro = async (e) => {
    e.preventDefault();
    const emailNormReg = regEmail.trim().toLowerCase();
    if (!regNombre.trim() || !emailNormReg || !regPassword) return setMsg({ text: 'Por favor, completa todos los campos.', type: 'warning' });
    if (!emailRegex.test(emailNormReg)) return setMsg({ text: 'Ingresa un correo electrónico válido.', type: 'warning' });
    if (regPassword.length < 6) return setMsg({ text: 'La contraseña debe tener al menos 6 caracteres.', type: 'warning' });
    setLoading(true); setMsg({ text: '', type: '' });
    try {
      await api.registro(regNombre.trim(), emailNormReg, regPassword, regRol);
      setMsg({ text: '¡Cuenta creada! Ya puedes iniciar sesión.', type: 'success' });
      setTimeout(() => cambiarModo('login'), 2000);
    } catch (err) {
      setMsg({ text: err.message || 'Error al crear cuenta', type: 'error' });
    } finally { setLoading(false); }
  };

  // Estilos inline del diseño del compañero
  const s = {
    page: {
      minHeight: '100vh', display: 'grid', placeItems: 'center',
      padding: 24, fontFamily: "'Inter', sans-serif",
      background: '#1A0D4B', position: 'relative', overflow: 'hidden',
    },
    slide: (url, active) => ({
      position: 'fixed', inset: 0, zIndex: -3,
      backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center',
      opacity: active ? 1 : 0, transform: active ? 'scale(1)' : 'scale(1.05)',
      transition: 'opacity 1.2s ease, transform 6s ease',
    }),
    overlay: {
      position: 'fixed', inset: 0, zIndex: -2,
      background: 'linear-gradient(135deg,rgba(26,13,75,.84),rgba(15,32,93,.60)),radial-gradient(circle at top right,rgba(193,18,98,.30),transparent 35%),radial-gradient(circle at bottom left,rgba(169,53,134,.24),transparent 35%)',
      backdropFilter: 'blur(2px)',
    },
    card: {
      position: 'relative', zIndex: 2, width: '100%', maxWidth: 470,
      padding: '42px 34px', borderRadius: 28,
      background: 'linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.08))',
      border: '1px solid rgba(255,255,255,.18)',
      boxShadow: '0 24px 60px rgba(0,0,0,.35)', backdropFilter: 'blur(20px)',
      color: '#fff',
    },
    badge: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '8px 14px', marginBottom: 18, borderRadius: 999,
      background: 'rgba(193,18,98,.18)', border: '1px solid rgba(255,255,255,.12)',
      fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.4px', color: '#fff',
    },
    h1: { fontSize: '2.35rem', marginBottom: 10, fontWeight: 800, lineHeight: 1.1, color: '#fff' },
    sub: { fontSize: '0.98rem', lineHeight: 1.7, color: 'rgba(255,255,255,.82)', marginBottom: 28 },
    label: { fontSize: '0.92rem', fontWeight: 600, color: '#fff', marginBottom: 8, display: 'block' },
    input: {
      width: '100%', height: 54, padding: '0 16px', borderRadius: 16,
      border: '1px solid rgba(255,255,255,.14)', background: 'rgba(255,255,255,.12)',
      color: '#fff', outline: 'none', fontSize: '0.96rem', fontFamily: 'inherit',
    },
    inputSel: {
      width: '100%', height: 54, padding: '0 16px', borderRadius: 16,
      border: '1px solid rgba(255,255,255,.14)', background: 'rgba(255,255,255,.12)',
      color: '#fff', outline: 'none', fontSize: '0.96rem', fontFamily: 'inherit',
    },
    pwWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
    togglePwd: {
      position: 'absolute', right: 10, height: 36, padding: '0 12px',
      border: '1px solid rgba(255,255,255,.14)', borderRadius: 10,
      background: 'rgba(255,255,255,.08)', color: '#fff',
      fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
    },
    btn: {
      marginTop: 6, height: 56, width: '100%', border: 'none', borderRadius: 18,
      background: 'linear-gradient(135deg,#C11262,#A93586)', color: '#fff',
      fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
      boxShadow: '0 16px 32px rgba(193,18,98,.28)', fontFamily: 'inherit',
      opacity: loading ? 0.7 : 1,
    },
    formGroup: { display: 'grid', gap: 8, marginBottom: 18 },
    msgColor: { error: '#FFD6E3', success: '#B8FFD7', warning: '#FFE7B8' },
    link: { color: '#FFD6E3', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' },
    note: { textAlign: 'center', fontSize: '0.88rem', color: 'rgba(255,255,255,.7)', marginTop: 16 },
  };

  return (
    <div style={s.page}>
      {/* Slider de fondo */}
      {LOGIN_SLIDES.map((url, i) => (
        <div key={i} style={s.slide(url, i === slideIdx)} />
      ))}
      <div style={s.overlay} />

      {/* Tarjeta */}
      <div style={s.card}>
        <div style={{ marginBottom: 28 }}>
          <span style={s.badge}>BDP · PyMEs</span>
          <h1 style={s.h1}>{modo === 'login' ? 'Bienvenido' : 'Crear Cuenta'}</h1>
          <p style={s.sub}>
            {modo === 'login'
              ? 'Accede de forma segura a la plataforma financiera empresarial.'
              : 'Completa los datos para registrarte en el sistema.'}
          </p>
        </div>

        {/* Mensaje */}
        {msg.text && (
          <p style={{ marginBottom: 14, fontSize: '0.9rem', fontWeight: 500, color: s.msgColor[msg.type] || '#fff' }}>
            {msg.text}
          </p>
        )}

        {/* FORMULARIO LOGIN */}
        {modo === 'login' && (
          <form onSubmit={doLogin} style={{ display: 'grid', gap: 0 }}>
            <div style={s.formGroup}>
              <label style={s.label}>Correo electrónico</label>
              <input style={s.input} type="email" placeholder="correo@bdp.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Contraseña</label>
              <div style={s.pwWrap}>
                <input style={{ ...s.input, paddingRight: 92 }}
                  type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" style={s.togglePwd} onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        )}

        {/* FORMULARIO REGISTRO */}
        {modo === 'registro' && (
          <form onSubmit={doRegistro} style={{ display: 'grid', gap: 0 }}>
            <div style={s.formGroup}>
              <label style={s.label}>Nombre Completo</label>
              <input style={s.input} type="text" placeholder="Ej: María Ávila"
                value={regNombre} onChange={e => setRegNombre(e.target.value)} />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Correo electrónico</label>
              <input style={s.input} type="email" placeholder="correo@bdp.com"
                value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Contraseña</label>
              <div style={s.pwWrap}>
                <input style={{ ...s.input, paddingRight: 92 }}
                  type={showPwd ? 'text' : 'password'} placeholder="Mínimo 6 caracteres"
                  value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                <button type="button" style={s.togglePwd} onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Rol</label>
              <select style={s.inputSel} value={regRol} onChange={e => setRegRol(e.target.value)}>
                <option value="analista">Analista Crédito</option>
                <option value="comite">Comité Crédito</option>
                <option value="auditor">Auditor Interno</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
        )}

        {/* Toggle login/registro */}
        <p style={s.note}>
          {modo === 'login' ? (
            <>¿No tienes cuenta?&nbsp;
              <span style={s.link} onClick={() => cambiarModo('registro')}>Regístrate aquí</span>
            </>
          ) : (
            <>¿Ya tienes cuenta?&nbsp;
              <span style={s.link} onClick={() => cambiarModo('login')}>Inicia sesión</span>
            </>
          )}
        </p>

        {modo === 'login' && (
          <p style={{ ...s.note, fontSize: '0.78rem', marginTop: 8, color: 'rgba(255,255,255,.5)' }}>
            Demo: analista@bdp.bo / password
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────── */
function Sidebar({ currentView, onNavigate, user, onCollapse, collapsed }) {
  const ini = user?.nombre?.split(' ').map(w => w[0]).join('').slice(0, 2) || 'US';

  return (
    <nav className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">B</div>
        <div className="sidebar-logo-text">
          <div className="brand">BDP Crédito</div>
          <div className="sub">Pyme · Banca Empresa</div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="avatar">{ini}</div>
        <div className="sidebar-user-info">
          <div className="name">{user?.nombre || 'Usuario'}</div>
          <div className="role">{user?.rol || ''}</div>
        </div>
        <div className="online"></div>
      </div>

      <div className="nav-group">
        <div className="nav-label">Principal</div>
        <NavItem icon="📊" label="Dashboard"      view="dashboard"   current={currentView} onNavigate={onNavigate} />
        <NavItem icon="📋" label="Solicitudes"    view="solicitudes" current={currentView} onNavigate={onNavigate} badge="12" />
        <NavItem icon="➕" label="Nueva Solicitud" view="nueva"       current={currentView} onNavigate={onNavigate} />
      </div>

      <div className="nav-group">
        <div className="nav-label">Análisis Crediticio</div>
        <NavItem icon="🧮" label="Evaluación Financiera"   view="financiero" current={currentView} onNavigate={onNavigate} />
        <NavItem icon="📈" label="Calificación de Riesgo"  view="riesgo"     current={currentView} onNavigate={onNavigate} />
        <NavItem icon="🏠" label="Garantías"               view="garantias"  current={currentView} onNavigate={onNavigate} />
      </div>

      <div className="nav-group">
        <div className="nav-label">Back Office</div>
        <NavItem icon="⚙"  label="Panel Administración"   view="admin"    current={currentView} onNavigate={onNavigate} />
        <NavItem icon="📑" label="Reportes & Exportación" view="reportes" current={currentView} onNavigate={onNavigate} />
      </div>

      <div className="collapse-btn" onClick={onCollapse}>
        <span className="collapse-icon">◀</span>
        <span className="collapse-label">Colapsar menú</span>
      </div>
    </nav>
  );
}

function NavItem({ icon, label, view, current, onNavigate, badge }) {
  return (
    <div className={`nav-item${current === view ? ' active' : ''}`} onClick={() => onNavigate(view)}>
      <span className="nav-icon">{icon}</span>
      <span className="nav-text">{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </div>
  );
}

/* ─── TOPBAR ─────────────────────────────────────────────────── */
function Topbar({ currentView, onLogout }) {
  const labels = {
    dashboard: 'Dashboard', solicitudes: 'Solicitudes', nueva: 'Nueva Solicitud',
    financiero: 'Evaluación Financiera', riesgo: 'Calificación de Riesgo',
    garantias: 'Garantías', admin: 'Panel Administración', reportes: 'Reportes',
  };

  return (
    <header className="topbar">
      <div className="breadcrumb">
        BDP <span className="sep">›</span>
        <span className="current">{labels[currentView] || currentView}</span>
      </div>
      <div className="topbar-right">
        <div className="search-bar">
          <span style={{ color: 'var(--gray-400)', fontSize: 13 }}>🔍</span>
          <input placeholder="Buscar cliente, NIT, solicitud..." aria-label="Buscar" />
        </div>
        <div className="status-chip">
          <div className="status-dot"></div>
          En línea
        </div>
        <div className="icon-btn" title="Notificaciones">🔔<div className="notif-dot"></div></div>
        <div className="icon-btn" onClick={onLogout} title="Cerrar sesión">🚪</div>
      </div>
    </header>
  );
}

/* ─── APP PRINCIPAL ──────────────────────────────────────────── */
export default function App() {
  const [user, setUser]             = useState(null);
  const [view, setView]             = useState('dashboard');
  const [collapsed, setCollapsed]   = useState(false);

  // Restaurar sesión si hay token guardado
  useEffect(() => {
    const savedUser = sessionStorage.getItem('bdp_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch { /* ignorar */ }
    }
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = async () => {
    try { await api.logout(); } catch { /* ignorar */ }
    sessionStorage.removeItem('bdp_token');
    sessionStorage.removeItem('bdp_user');
    setUser(null);
    setView('dashboard');
  };

  const views = {
    dashboard:   <DashboardView onNavigate={setView} />,
    solicitudes: <SolicitudesView onNavigate={setView} />,
    nueva:       <NuevaSolicitudView />,
    financiero:  <EvaluacionView />,
    riesgo:      <RiesgoView />,
    garantias:   <GarantiasView />,
    admin:       <AdminView />,
    reportes:    <ReportesView onNavigate={setView} />,
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div id="app" className="show">
      <Sidebar
        currentView={view}
        onNavigate={setView}
        user={user}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
      />
      <div className="main">
        <Topbar currentView={view} onLogout={handleLogout} />
        <div className="content">
          {views[view] || views.dashboard}
        </div>
      </div>
      <DevTaskPanel vista="App" />
    </div>
  );
}
