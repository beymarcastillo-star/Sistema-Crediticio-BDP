/**
 * ═══════════════════════════════════════════════════════════
 * BDP — PLATAFORMA CREDITICIA  |  app.js
 * Banco de Desarrollo Productivo S.A.M.
 *
 * Módulos:
 *  01. Auth          — Login JWT, sesión, bloqueo
 *  02. Router        — Navegación SPA
 *  03. Auditoria     — Log WORM en memoria
 *  04. Charts        — Gráficos SVG dinámicos
 *  05. Formularios   — Checklist, sector, wizard
 *  06. Scoring       — Motor de calificación crediticia
 *  07. Financiero    — Flujo de caja, supuestos, recálculo
 *  08. Offline       — Detección de conectividad
 *  09. Modales       — Control de overlays
 *  10. Permisos      — Toggles de roles RBAC
 * ═══════════════════════════════════════════════════════════
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   01. AUTH — Login JWT simulado con bloqueo de 3 intentos
   ═══════════════════════════════════════════════════════════ */
const Auth = (() => {
  const MAX_ATTEMPTS = 3;
  let attempts = 0;
  let currentUser = null;

  /** Usuarios válidos del sistema (simulación) */
  const USERS = [
    { user: 'analista@bdp.bo',  pass: 'password', name: 'María Ávila',     role: 'Analista Crédito',  avatar: 'MA', avatarClass: '' },
    { user: 'admin@bdp.bo',     pass: 'admin123', name: 'Carlos Mamani',   role: 'Administrador',     avatar: 'CM', avatarClass: 'orange' },
    { user: 'comite@bdp.bo',    pass: 'comite123',name: 'Roberto Flores',  role: 'Comité Crédito',    avatar: 'RF', avatarClass: 'green' },
    { user: 'auditoria@bdp.bo', pass: 'audit123', name: 'Laura Arias',     role: 'Auditora Interna',  avatar: 'LA', avatarClass: 'purple' },
  ];

  function generateJWT(user) {
    // Simulación de JWT — en producción viene del backend POST /api/v1/auth/login
    const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.user, name: user.name, role: user.role,
      iat: Math.floor(Date.now()/1000),
      exp: Math.floor(Date.now()/1000) + 3600,
    }));
    const sig = btoa(`bdp-${user.user}-${Date.now()}`).slice(0, 20);
    return `${header}.${payload}.${sig}`;
  }

  function login() {
    const u = document.getElementById('loginUser')?.value.trim();
    const p = document.getElementById('loginPwd')?.value.trim();

    const found = USERS.find(x => x.user === u && x.pass === p);
    if (found) {
      const token = generateJWT(found);
      sessionStorage.setItem('bdp_token', token);
      sessionStorage.setItem('bdp_user', JSON.stringify(found));
      currentUser = found;

      // Actualizar UI con datos del usuario
      document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = found.name);
      document.querySelectorAll('[data-user-role]').forEach(el => el.textContent = found.role);
      document.querySelectorAll('[data-user-avatar]').forEach(el => {
        el.textContent = found.avatar;
        el.className = `avatar ${found.avatarClass}`;
      });

      document.getElementById('screen-login').style.display = 'none';
      document.getElementById('app').classList.add('show');

      Auditoria.log('INSERT', 'sesiones', `LOGIN-${Date.now()}`, found.user);
      Charts.init();
      return;
    }

    // Login fallido
    attempts++;
    const banner = document.getElementById('errBanner');
    const msg    = document.getElementById('errMsg');
    const btn    = document.querySelector('.btn-login');
    banner.classList.add('show');

    if (attempts >= MAX_ATTEMPTS) {
      msg.textContent = '🚫 Acceso bloqueado. Contacte al administrador del sistema.';
      btn.disabled = true;
      Auditoria.log('INSERT', 'sesiones', `BLOCKED-${Date.now()}`, u || 'desconocido');
    } else {
      msg.textContent = `Credenciales incorrectas. Intentos restantes: ${MAX_ATTEMPTS - attempts}`;
      document.getElementById('loginPwd')?.classList.add('err');
    }
  }

  function logout() {
    if (currentUser) {
      Auditoria.log('INSERT', 'sesiones', `LOGOUT-${Date.now()}`, currentUser.user);
    }
    sessionStorage.removeItem('bdp_token');
    sessionStorage.removeItem('bdp_user');
    currentUser = null;
    attempts = 0;

    document.getElementById('app').classList.remove('show');
    document.getElementById('screen-login').style.display = 'flex';

    const btn = document.querySelector('.btn-login');
    if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
    document.getElementById('errBanner')?.classList.remove('show');
    document.getElementById('loginPwd')?.classList.remove('err');
  }

  function togglePwd() {
    const f = document.getElementById('loginPwd');
    if (!f) return;
    f.type = f.type === 'password' ? 'text' : 'password';
  }

  return { login, logout, togglePwd };
})();


/* ═══════════════════════════════════════════════════════════
   02. ROUTER — Navegación SPA sin recarga
   ═══════════════════════════════════════════════════════════ */
const Router = (() => {
  const LABELS = {
    dashboard:  'Dashboard',
    solicitudes:'Solicitudes',
    nueva:      'Nueva Solicitud',
    financiero: 'Evaluación Financiera',
    riesgo:     'Calificación de Riesgo',
    garantias:  'Garantías',
    admin:      'Panel Administración',
    reportes:   'Reportes & Exportación',
  };

  function go(id, navEl) {
    // Ocultar todas las vistas
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Mostrar vista
    const view = document.getElementById(`v-${id}`);
    if (view) view.classList.add('active');

    // Marcar nav activo
    if (navEl) {
      navEl.classList.add('active');
    } else {
      document.querySelectorAll('.nav-item').forEach(n => {
        const onclick = n.getAttribute('onclick') || '';
        if (onclick.includes(`'${id}'`)) n.classList.add('active');
      });
    }

    // Actualizar breadcrumb
    const bc = document.getElementById('bcCurrent');
    if (bc) bc.textContent = LABELS[id] || id;

    // Lazy init
    if (id === 'financiero') Charts.renderFlujoCaja();
    if (id === 'financiero') Charts.renderProyecciones();
    if (id === 'riesgo')     Scoring.animateGauge();
    if (id === 'admin')      Auditoria.renderTable();
  }

  function collapseNav() {
    document.getElementById('sidebar')?.classList.toggle('collapsed');
  }

  return { go, collapseNav };
})();


/* ═══════════════════════════════════════════════════════════
   03. AUDITORIA — Log WORM en memoria (RNF — Logs inmutables)
   En producción: GET/POST /api/v1/auditoria
   ═══════════════════════════════════════════════════════════ */
const Auditoria = (() => {
  // Hash encadenado simple (SHA-like simulado)
  const _logs = [];
  let _lastHash = '0000000000000000';

  function _simHash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i);
    }
    return (h >>> 0).toString(16).padStart(16, '0');
  }

  function log(operacion, tabla, registro, usuario) {
    const ts   = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const data = `${ts}${operacion}${tabla}${registro}${usuario}${_lastHash}`;
    const hash = _simHash(data);
    _lastHash  = hash;

    _logs.unshift({ ts, usuario, ip: '192.168.1.' + Math.floor(Math.random()*200+10), operacion, tabla, registro, hash });
    // Inmutable — no se puede modificar ni eliminar
    Object.freeze(_logs[0]);
  }

  function renderTable() {
    const tbody = document.getElementById('auditLogBody');
    if (!tbody) return;

    const display = _logs.length > 0 ? _logs : getSampleLogs();
    tbody.innerHTML = display.slice(0, 20).map(l => `
      <tr>
        <td>${l.ts}</td>
        <td>${l.usuario}</td>
        <td>${l.ip}</td>
        <td><span class="op-${l.operacion.toLowerCase().slice(0,3)}">${l.operacion}</span></td>
        <td>${l.tabla}</td>
        <td>${l.registro}</td>
        <td style="color:var(--gray-400)">${l.hash.slice(0,12)}…</td>
      </tr>
    `).join('');

    const counter = document.getElementById('auditCounter');
    if (counter) counter.textContent = `${display.length + 1841} entradas`;
  }

  function getSampleLogs() {
    return [
      { ts:'2024-06-15 14:32:07', usuario:'m.avila',  ip:'192.168.1.45', operacion:'UPDATE', tabla:'solicitudes',  registro:'SOL-2024-089', hash:'a3f7b2c9d1e4f5a6' },
      { ts:'2024-06-15 14:28:15', usuario:'m.avila',  ip:'192.168.1.45', operacion:'INSERT', tabla:'garantias',    registro:'GAR-2024-045', hash:'9d2e1a4f7c3b8e0f' },
      { ts:'2024-06-15 13:55:42', usuario:'c.mamani', ip:'192.168.1.72', operacion:'UPDATE', tabla:'solicitudes',  registro:'SOL-2024-086', hash:'e8c3f5a1d9b2c7e4' },
      { ts:'2024-06-15 13:12:08', usuario:'r.flores', ip:'192.168.1.58', operacion:'INSERT', tabla:'evaluaciones', registro:'EVA-2024-088', hash:'2b7d9e6c4f1a3d5c' },
      { ts:'2024-06-15 11:45:33', usuario:'l.arias',  ip:'192.168.1.91', operacion:'DELETE', tabla:'borradores',   registro:'DRF-2024-012', hash:'7f4a2c8e5b3d9f1e' },
      { ts:'2024-06-15 10:20:11', usuario:'admin',    ip:'192.168.1.10', operacion:'INSERT', tabla:'usuarios',     registro:'USR-0042',      hash:'3c9e7a1f4d8b2e6a' },
    ];
  }

  // Inicializar con logs de muestra
  getSampleLogs().forEach(l => _logs.push(l));

  return { log, renderTable };
})();


/* ═══════════════════════════════════════════════════════════
   04. CHARTS — Gráficos dinámicos con canvas API o SVG
   ═══════════════════════════════════════════════════════════ */
const Charts = (() => {
  function init() {
    renderFlujoCaja();
    renderProyecciones();
  }

  function renderFlujoCaja() {
    const container = document.getElementById('flujoBars');
    const labelsEl  = document.getElementById('flujoLabels');
    if (!container) return;

    const months  = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const actual  = [0,0,120,890,650,320,0,0,180,960,720,380];
    const stress  = [0,0,84,623,455,224,0,0,126,672,504,266];
    const max     = Math.max(...actual);

    container.innerHTML = '';
    labelsEl.innerHTML  = '';

    months.forEach((m, i) => {
      const g  = document.createElement('div'); g.className = 'c-bar-group';
      const b1 = document.createElement('div');
      b1.className = 'c-bar actual';
      b1.style.height = ((actual[i] / max) * 140 + 2) + 'px';
      b1.title = `Real/Proyectado: Bs. ${actual[i].toLocaleString()}k`;

      const b2 = document.createElement('div');
      b2.className = 'c-bar projected';
      b2.style.height = ((stress[i] / max) * 140 + 2) + 'px';
      b2.title = `Escenario estrés (-30%): Bs. ${stress[i].toLocaleString()}k`;

      g.appendChild(b1); g.appendChild(b2);
      container.appendChild(g);

      const l = document.createElement('div'); l.className = 'c-lbl'; l.textContent = m;
      labelsEl.appendChild(l);
    });
  }

  function renderProyecciones() {
    const c = document.getElementById('projBars');
    const l = document.getElementById('projLabels');
    if (!c) return;

    const years = ['Año 1','Año 2','Año 3','Año 4','Año 5'];
    const vals  = [2.3, 2.9, 3.4, 3.8, 4.2];
    const max   = Math.max(...vals);

    c.innerHTML = ''; l.innerHTML = '';
    years.forEach((y, i) => {
      const b = document.createElement('div');
      b.className = 'c-bar actual'; b.style.flex = '1';
      b.style.height = ((vals[i] / max) * 160) + 'px';
      b.title = `Bs. ${vals[i]}M`;
      c.appendChild(b);

      const lb = document.createElement('div'); lb.className = 'c-lbl'; lb.textContent = y;
      l.appendChild(lb);
    });
  }

  return { init, renderFlujoCaja, renderProyecciones };
})();


/* ═══════════════════════════════════════════════════════════
   05. FORMULARIOS — Checklist, sector, wizard, upload
   ═══════════════════════════════════════════════════════════ */
const Formularios = (() => {
  function toggleChk(el) {
    if (el.classList.contains('locked')) return;
    el.classList.toggle('done');
    const box = el.querySelector('.chk-box');
    const tag = el.querySelector('.chk-tag');
    if (el.classList.contains('done')) {
      box.textContent = '✓'; tag.textContent = 'Completo'; tag.className = 'chk-tag';
      Auditoria.log('UPDATE', 'checklist', el.dataset.doc || 'DOC-' + Date.now(), 'analista');
    } else {
      box.textContent = ''; tag.textContent = 'Pendiente'; tag.className = 'chk-tag pending';
    }
  }

  function selSector(el) {
    document.querySelectorAll('.sector-btn').forEach(b => b.classList.remove('sel'));
    el.classList.add('sel');
    const sector = el.querySelector('.sector-name')?.textContent;
    const agriEl = document.getElementById('agriExtra');
    if (agriEl) agriEl.style.display = (sector === 'Pecuario') ? 'none' : 'block';
  }

  function simulateUpload() {
    const list = document.getElementById('fileList');
    if (!list) return;
    const exts  = ['pdf', 'xlsx', 'jpg', 'docx'];
    const names = ['Contrato_', 'Balance_', 'Garantia_', 'Solicitud_'];
    const name  = names[Math.floor(Math.random() * names.length)] + (Date.now() % 10000);
    const ext   = exts[Math.floor(Math.random() * exts.length)];
    const size  = (Math.random() * 4 + 0.5).toFixed(1);

    const item = document.createElement('div'); item.className = 'file-item';
    item.innerHTML = `
      <div class="file-ico">📄</div>
      <div class="file-info">
        <div class="file-name">${name}.${ext}</div>
        <div class="file-size">Subiendo…</div>
      </div>
      <div class="file-ok" style="color:var(--yellow)">⏳</div>
    `;
    list.appendChild(item);

    setTimeout(() => {
      item.querySelector('.file-ok').textContent = '✓ Verificado';
      item.querySelector('.file-ok').style.color = 'var(--green)';
      item.querySelector('.file-size').textContent = `${size} MB · Subido ahora`;
      Auditoria.log('INSERT', 'documentos', `${name}.${ext}`, 'analista');
    }, 1400);
  }

  return { toggleChk, selSector, simulateUpload };
})();


/* ═══════════════════════════════════════════════════════════
   06. SCORING — Motor de calificación crediticia (RF-09)
   ═══════════════════════════════════════════════════════════ */
const Scoring = (() => {
  const WEIGHTS = { financiero: .4, historial: .25, sectorial: .15, garantias: .12, clima: .08 };

  function calcScore(factores) {
    return Math.round(
      factores.financiero * WEIGHTS.financiero  * 1000 +
      factores.historial  * WEIGHTS.historial   * 1000 +
      factores.sectorial  * WEIGHTS.sectorial   * 1000 +
      factores.garantias  * WEIGHTS.garantias   * 1000 +
      factores.clima      * WEIGHTS.clima       * 1000
    );
  }

  function animateGauge() {
    const cursor = document.querySelector('.risk-cursor');
    if (!cursor) return;
    const score = 724;
    const pct   = score / 1000;          // 0–1
    const pos   = Math.min(pct * 100, 95); // % en la barra
    setTimeout(() => { cursor.style.left = `${pos}%`; }, 100);
  }

  return { calcScore, animateGauge };
})();


/* ═══════════════════════════════════════════════════════════
   07. FINANCIERO — Supuestos y recálculo en tiempo real
   ═══════════════════════════════════════════════════════════ */
const Financiero = (() => {
  function recalc() {
    const precio     = parseFloat(document.querySelector('.sup-input:nth-of-type(1)')?.value || 280);
    const rendimiento= parseFloat(document.querySelector('.sup-input:nth-of-type(2)')?.value || 45);
    const escenario  = document.querySelector('.sup-input select, select.sup-input')?.value || 'Normal';
    const tasa       = parseFloat(document.querySelector('.sup-input:nth-of-type(4)')?.value || 6.5);
    const hectareas  = 250;
    const monto      = 850000;

    let factor = 1;
    if (escenario.includes('leve'))     factor = .85;
    if (escenario.includes('moderada')) factor = .70;
    if (escenario.includes('severa'))   factor = .50;

    const ingresos = Math.round(precio * rendimiento * hectareas * factor);
    const costos   = Math.round(hectareas * 3260);
    const cuota    = Math.round(monto * (tasa/100/12) / (1 - Math.pow(1+tasa/100/12, -60)));
    const cobertura= Math.round((ingresos - costos) / (cuota * 12) * 100);

    const r1 = document.getElementById('r1');
    const r2 = document.getElementById('r2');
    const r3 = document.getElementById('r3');
    const r4 = document.getElementById('r4');

    if (r1) r1.textContent = `Bs. ${ingresos.toLocaleString()}`;
    if (r2) r2.textContent = `(Bs. ${costos.toLocaleString()})`;
    if (r3) { r3.textContent = `${cobertura}%`; r3.className = `result-val ${cobertura > 180 ? 'good' : cobertura > 120 ? 'warn' : 'bad'}`; }
    if (r4) {
      if (cobertura > 180) {
        r4.textContent = '✓ Viable'; r4.className = 'badge b-green';
      } else if (cobertura > 100) {
        r4.textContent = '⚠ Viable con ajuste'; r4.className = 'badge b-yellow';
      } else {
        r4.textContent = '✗ No viable'; r4.className = 'badge b-red';
      }
    }
  }

  return { recalc };
})();


/* ═══════════════════════════════════════════════════════════
   08. OFFLINE — Detección de conectividad (RNF-01)
   ═══════════════════════════════════════════════════════════ */
const Offline = (() => {
  let isOffline = false;

  function toggle() {
    isOffline = !isOffline;
    const bar  = document.getElementById('offlineBar');
    const chip = document.getElementById('statusChip');
    bar?.classList.toggle('show', isOffline);
    if (chip) {
      chip.className = 'status-chip' + (isOffline ? ' offline' : '');
      chip.innerHTML = `<div class="status-dot"></div>${isOffline ? 'Sin conexión' : 'En línea'}`;
    }
    if (isOffline) Auditoria.log('UPDATE', 'sistema', 'OFFLINE-MODE', 'sistema');
  }

  // Escuchar eventos reales del navegador
  window.addEventListener('online',  () => { if (isOffline) toggle(); });
  window.addEventListener('offline', () => { if (!isOffline) toggle(); });

  return { toggle };
})();


/* ═══════════════════════════════════════════════════════════
   09. MODALES — Control de overlays
   ═══════════════════════════════════════════════════════════ */
const Modales = (() => {
  function open(id)  { document.getElementById(id)?.classList.add('open'); }
  function close(id) { document.getElementById(id)?.classList.remove('open'); }

  // Cerrar al hacer clic fuera
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
    }
  });

  // Cerrar con ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    }
  });

  return { open, close };
})();


/* ═══════════════════════════════════════════════════════════
   10. PERMISOS — Toggles RBAC
   ═══════════════════════════════════════════════════════════ */
const Permisos = (() => {
  function flipToggle(wrap) {
    const track = wrap.querySelector('.toggle-track');
    if (!track) return;
    track.classList.toggle('on');
    Auditoria.log('UPDATE', 'permisos', `PERM-${Date.now()}`, 'admin');
  }

  return { flipToggle };
})();


/* ═══════════════════════════════════════════════════════════
   TABS — Manejador de pestañas
   ═══════════════════════════════════════════════════════════ */
function swTab(el, contentId) {
  const container = el.closest('.view') || document;
  container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById(contentId)?.classList.add('active');
}


/* ═══════════════════════════════════════════════════════════
   EXPOSICIÓN GLOBAL — Handlers del HTML (onclick=...)
   ═══════════════════════════════════════════════════════════ */
window.doLogin       = () => Auth.login();
window.logout        = () => Auth.logout();
window.togglePwd     = () => Auth.togglePwd();
window.go            = (id, el) => Router.go(id, el);
window.collapseNav   = () => Router.collapseNav();
window.swTab         = swTab;
window.toggleOffline = () => Offline.toggle();
window.openModal     = (id) => Modales.open(id);
window.closeModal    = (id) => Modales.close(id);
window.toggleChk     = (el) => Formularios.toggleChk(el);
window.selSector     = (el) => Formularios.selSector(el);
window.simulateUpload= () => Formularios.simulateUpload();
window.flipToggle    = (wrap) => Permisos.flipToggle(wrap);
window.recalc        = () => Financiero.recalc();

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  // Enter en login
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('screen-login')?.style.display !== 'none') {
      Auth.login();
    }
  });

  // Tooltips del sidebar colapsado
  document.querySelectorAll('.nav-item').forEach(item => {
    const text = item.querySelector('.nav-text')?.textContent;
    if (text) item.setAttribute('title', text);
  });
});
