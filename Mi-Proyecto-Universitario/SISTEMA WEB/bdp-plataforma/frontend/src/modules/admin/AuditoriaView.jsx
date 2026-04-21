// frontend/src/modules/admin/AuditoriaView.jsx
// Página de Auditoría WORM — HU-02 (Abygail & Beymar) integrada a bdp-plataforma
// Adaptada: usa api.js (sessionStorage, /api/v1/auditoria) y esquema propio
import { useState, useEffect, useCallback } from 'react';
import AuditoriaTable from './AuditoriaTable.jsx';
import { api } from '../../services/api.js';

// ── Datos demo cuando el backend no está disponible ──────────
const DATOS_DEMO = [
  { id: 1, timestamp_utc: new Date().toISOString(), usuario_email: 'admin@bdp.bo',     ip_origen: '192.168.1.10', operacion: 'LOGIN',  tabla: 'Autenticación',  registro_id: null,      hash_actual: 'a3f8c2d1e4b5f6a7b8c9d0e1f2a3b4c5d6e7' },
  { id: 2, timestamp_utc: new Date().toISOString(), usuario_email: 'analista@bdp.bo',  ip_origen: '192.168.1.11', operacion: 'VIEW',   tabla: 'solicitudes',    registro_id: 'SOL-089', hash_actual: 'b4c9d2e5f6a7b8c9d0e1f2a3b4c5d6e7f8' },
  { id: 3, timestamp_utc: new Date().toISOString(), usuario_email: 'analista@bdp.bo',  ip_origen: '192.168.1.11', operacion: 'INSERT', tabla: 'solicitudes',    registro_id: 'SOL-090', hash_actual: 'c5d0e3f6a7b8c9d0e1f2a3b4c5d6e7f8a9' },
  { id: 4, timestamp_utc: new Date().toISOString(), usuario_email: 'comite@bdp.bo',    ip_origen: '192.168.1.12', operacion: 'UPDATE', tabla: 'evaluaciones',   registro_id: 'EVA-045', hash_actual: 'd6e1f4a7b8c9d0e1f2a3b4c5d6e7f8a9b0' },
  { id: 5, timestamp_utc: new Date().toISOString(), usuario_email: 'admin@bdp.bo',     ip_origen: '192.168.1.10', operacion: 'EXPORT', tabla: 'reportes',       registro_id: null,      hash_actual: 'e7f2a5b8c9d0e1f2a3b4c5d6e7f8a9b0c1' },
  { id: 6, timestamp_utc: new Date().toISOString(), usuario_email: 'auditoria@bdp.bo', ip_origen: '192.168.1.15', operacion: 'VIEW',   tabla: 'auditoria',      registro_id: null,      hash_actual: 'f8a3b6c9d0e1f2a3b4c5d6e7f8a9b0c1d2' },
  { id: 7, timestamp_utc: new Date().toISOString(), usuario_email: 'analista@bdp.bo',  ip_origen: '192.168.1.11', operacion: 'DELETE', tabla: 'documentos',     registro_id: 'DOC-089', hash_actual: 'a9b4c7d0e1f2a3b4c5d6e7f8a9b0c1d2e3' },
  { id: 8, timestamp_utc: new Date().toISOString(), usuario_email: 'sistema',           ip_origen: '127.0.0.1',    operacion: 'ERROR',  tabla: 'core_bancario',  registro_id: null,      hash_actual: 'b0c5d8e1f2a3b4c5d6e7f8a9b0c1d2e3f4' },
  { id: 9, timestamp_utc: new Date().toISOString(), usuario_email: 'comite@bdp.bo',    ip_origen: '192.168.1.12', operacion: 'LOGIN',  tabla: 'Autenticación',  registro_id: null,      hash_actual: 'c1d6e9f2a3b4c5d6e7f8a9b0c1d2e3f4a5' },
  { id: 10,timestamp_utc: new Date().toISOString(), usuario_email: 'analista@bdp.bo',  ip_origen: '192.168.1.11', operacion: 'INSERT', tabla: 'garantias',      registro_id: 'GAR-012', hash_actual: 'd2e7f0a3b4c5d6e7f8a9b0c1d2e3f4a5b6' },
];
const RESUMEN_DEMO = { total_hoy: 10, usuarios_activos: 4, acciones_criticas: 1, ultimo_registro: new Date().toISOString() };

const TARJETAS = [
  { key: 'total_hoy',         label: 'REGISTROS HOY',     icono: '👁',  color: '#0e2a4b', bgIcon: 'rgba(14,42,75,0.1)' },
  { key: 'usuarios_activos',  label: 'USUARIOS ACTIVOS',  icono: '👥',  color: '#0369A1', bgIcon: 'rgba(3,105,161,0.1)' },
  { key: 'acciones_criticas', label: 'ACCIONES CRÍTICAS', icono: '⚡',  color: '#dc2626', bgIcon: 'rgba(220,38,38,0.1)', alerta: true },
  { key: 'ultimo_registro',   label: 'ÚLTIMO REGISTRO',   icono: '🕐',  color: '#059669', bgIcon: 'rgba(5,150,105,0.1)', esFecha: true },
];

const formatTiempoRelativo = (iso) => {
  if (!iso) return '—';
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)   return `hace ${diff}s`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}min`;
  return `hace ${Math.floor(diff / 3600)}h`;
};

const TarjetaResumen = ({ cfg, valor, cargando }) => {
  const display = cfg.esFecha
    ? formatTiempoRelativo(valor)
    : (parseInt(valor) || 0).toLocaleString('es-BO');

  return (
    <div style={{
      background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(10px)',
      borderRadius: 16, border: '1px solid #E2E8F0', padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, #0e2a4b, #1db6b4)`, borderRadius: '16px 16px 0 0' }} />
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, background: cfg.bgIcon, fontSize: 18, marginBottom: 14 }}>
        {cfg.icono}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
        {cfg.label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: cfg.alerta && parseInt(valor) > 0 ? '#dc2626' : '#0e2a4b', lineHeight: 1 }}>
        {cargando ? '…' : display}
      </div>
      {!cfg.esFecha && !cargando && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#10B981', fontWeight: 500 }}>↑ en tiempo real</div>
      )}
    </div>
  );
};

export default function AuditoriaView() {
  const [logs,         setLogs]         = useState([]);
  const [resumen,      setResumen]      = useState({});
  const [cargando,     setCargando]     = useState(false);
  const [cargandoRes,  setCargandoRes]  = useState(true);
  const [esDemo,       setEsDemo]       = useState(false);
  const [pagina,       setPagina]       = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total,        setTotal]        = useState(0);
  const [exportando,   setExportando]   = useState(false);

  const [filtrosTemp, setFiltrosTemp] = useState({ desde: '', hasta: '', operacion: '', usuario: '' });
  const [filtros,     setFiltros]     = useState({ desde: '', hasta: '', operacion: '', usuario: '' });

  const cargarResumen = useCallback(async () => {
    try {
      setCargandoRes(true);
      const data = await api.getResumen();
      setResumen(data.resumen || {});
      setEsDemo(false);
    } catch {
      setResumen(RESUMEN_DEMO);
      setEsDemo(true);
    } finally {
      setCargandoRes(false);
    }
  }, []);

  const cargarLogs = useCallback(async (f, pag = 1) => {
    setCargando(true);
    try {
      const params = { pagina: pag, limite: 20 };
      if (f.desde)     params.desde     = f.desde;
      if (f.hasta)     params.hasta     = f.hasta;
      if (f.operacion) params.operacion = f.operacion;
      if (f.usuario)   params.usuario   = f.usuario;
      const data = await api.getLogs(params);
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      const pags = Math.ceil((data.total || 0) / 20) || 1;
      setTotalPaginas(pags);
      setPagina(pag);
      setEsDemo(false);
    } catch {
      setLogs(DATOS_DEMO);
      setTotal(DATOS_DEMO.length);
      setTotalPaginas(1);
      setPagina(1);
      setEsDemo(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarResumen();
    cargarLogs(filtros, 1);
    const iv = setInterval(() => { cargarResumen(); cargarLogs(filtros, pagina); }, 30000);
    return () => clearInterval(iv);
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    setFiltros({ ...filtrosTemp });
    cargarLogs(filtrosTemp, 1);
  };

  const handleLimpiar = () => {
    const vacio = { desde: '', hasta: '', operacion: '', usuario: '' };
    setFiltros(vacio);
    setFiltrosTemp(vacio);
    cargarLogs(vacio, 1);
  };

  const handleExportar = () => {
    const token = sessionStorage.getItem('bdp_token');
    const params = new URLSearchParams({ ...filtros, formato: 'csv' });
    const url = `/api/v1/auditoria/export?${params}`;
    // Descarga directa
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const inp = {
    padding: '9px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB',
    background: '#fff', color: '#0e2a4b', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  };
  const btnPrim = {
    padding: '10px 22px', borderRadius: 8, border: 'none',
    background: 'linear-gradient(135deg, #0e2a4b, #123d6b)', color: '#fff',
    fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
  };
  const btnSec = {
    padding: '10px 16px', borderRadius: 8, border: '1px solid #CBD5E1',
    background: 'transparent', color: '#64748B', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
  };

  return (
    <div className="view-fade">
      {/* ── TARJETAS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
        {TARJETAS.map(cfg => (
          <TarjetaResumen key={cfg.key} cfg={cfg} valor={resumen[cfg.key]} cargando={cargandoRes} />
        ))}
      </div>

      {/* ── FILTROS ── */}
      <div style={{ background: 'rgba(255,255,255,0.82)', borderRadius: 16, border: '1px solid #E2E8F0', padding: '20px 24px', marginBottom: 20, backdropFilter: 'blur(10px)' }}>
        <form onSubmit={handleBuscar} style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: '📅 Desde',    key: 'desde', type: 'date' },
            { label: '📅 Hasta',    key: 'hasta', type: 'date' },
          ].map(f => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: '1', minWidth: 150 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</label>
              <input type={f.type} style={inp} value={filtrosTemp[f.key]} onChange={e => setFiltrosTemp(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: '1', minWidth: 150 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>⚡ Operación</label>
            <select style={inp} value={filtrosTemp.operacion} onChange={e => setFiltrosTemp(p => ({ ...p, operacion: e.target.value }))}>
              <option value="">Todas</option>
              {['LOGIN','LOGOUT','INSERT','UPDATE','DELETE','EXPORT','VIEW','ERROR'].map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: '1', minWidth: 150 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>👤 Usuario</label>
            <input type="text" placeholder="Buscar usuario..." style={inp} value={filtrosTemp.usuario} onChange={e => setFiltrosTemp(p => ({ ...p, usuario: e.target.value }))} />
          </div>
          <button type="submit" disabled={cargando} style={btnPrim}>
            {cargando ? '⏳ Buscando...' : '🔍 Buscar'}
          </button>
          <button type="button" onClick={handleLimpiar} style={btnSec}>✕ Limpiar</button>
          <button type="button" disabled={exportando} onClick={handleExportar}
            style={{ ...btnSec, borderColor: '#1db6b4', color: '#0e2a4b' }}>
            ⬇ Exportar CSV
          </button>
        </form>
      </div>

      {/* ── AVISO DEMO ── */}
      {esDemo && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFF8E1', border: '1px solid #FFD54F', borderRadius: 10, padding: '12px 20px', color: '#92400E', fontSize: 13, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>🔌</span>
          <span><strong>Modo demostración</strong> — Backend no disponible o sin registros. Se muestran datos de ejemplo.</span>
        </div>
      )}

      {/* ── TABLA ── */}
      <AuditoriaTable
        logs={logs}
        total={total}
        pagina={pagina}
        paginas={totalPaginas}
        cargando={cargando}
        onCambiarPagina={(p) => cargarLogs(filtros, p)}
      />
    </div>
  );
}
