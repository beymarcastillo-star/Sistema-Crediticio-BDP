// frontend/src/modules/reportes/ReportesView.jsx
// ============================================================
// TAREAS PENDIENTES — ReportesView.jsx
// ── P3 🟠 Norma · HU-09 (CORE Bancario) ─────────────────────
// TODO (P3 · Norma · HU-09): Reemplazar checklist estático por tarjetas de estado dinámico
// TODO (P3 · Norma · HU-09): Botón "Probar conexión" que simule llamada y muestre latencia
// TODO (P3 · Norma · HU-09): Sección "Últimas sincronizaciones": tabla timestamp/operación/resultado
// ── P3 🟠 Norma · HU-12 (Reportes) ──────────────────────────
// TODO (P3 · Norma · HU-12): Filtros antes de generar: selector solicitud, rango fechas, sector
// TODO (P3 · Norma · HU-12): Botón "Generar PDF": spinner "Generando..." → "Reporte listo"
// TODO (P3 · Norma · HU-12): Botón "Exportar Excel": mismo flujo spinner que PDF
// ============================================================
import { useState } from 'react';
import Modal from '../../components/Modal.jsx';
import DevTaskPanel from '../../components/DevTaskPanel.jsx';

export default function ReportesView({ onNavigate }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Reportes &amp; Exportación</div>
          <div className="page-sub">RF-05 · Generación automática PDF y Excel</div>
        </div>
      </div>

      <div className="g3 mb20">
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => setModalOpen(true)}>
          <div className="card-body" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--blue-900)', marginBottom: 6 }}>Resumen Comité</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Informe ejecutivo para presentación al comité de crédito</div>
            <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Generar PDF</button>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--blue-900)', marginBottom: 6 }}>Cartera Analítica</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Estado completo de la cartera con filtros por sector y estado</div>
            <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Exportar Excel</button>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--blue-900)', marginBottom: 6 }}>Reporte Auditoría</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Log completo e inalterable de todas las operaciones</div>
            <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate('admin')}>Ver Logs</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">API REST — Integración CORE Bancario</div><span className="badge b-green">RF-04 · JWT Auth</span></div>
        <div className="card-body">
          <div className="g2">
            <div>
              <div className="info-box mb20"><strong>RF-04:</strong> Comunicación con el CORE bancario vía API-REST, autenticación JWT, respuestas JSON.</div>
              <div style={{ background: 'var(--gray-800)', borderRadius: 10, padding: 16, fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: '#E2E8F0', lineHeight: 1.9 }}>
                <span style={{ color: '#60A5FA' }}>POST</span> /api/v1/credito/solicitud<br />
                <span style={{ color: '#FBBF24' }}>Authorization:</span> Bearer &lt;JWT&gt;<br />
                <span style={{ color: '#FBBF24' }}>Content-Type:</span> application/json<br /><br />
                <span style={{ color: '#34D399' }}>// 201 Created</span><br />
                {'{'}<br />&nbsp;&nbsp;<span style={{ color: '#FBBF24' }}>"id"</span>: <span style={{ color: '#86EFAC' }}>"SOL-2024-089"</span>,<br />&nbsp;&nbsp;<span style={{ color: '#FBBF24' }}>"status"</span>: <span style={{ color: '#86EFAC' }}>"created"</span><br />{'}'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--text-muted)', marginBottom: 12 }}>Estado de Endpoints</div>
              <div className="checklist">
                {[
                  { path: 'POST /api/v1/auth/login', done: true },
                  { path: 'GET  /api/v1/auditoria', done: true },
                  { path: 'GET  /api/v1/auditoria/verificar', done: true },
                  { path: 'POST /api/v1/creditos', done: false },
                  { path: 'GET  /api/v1/creditos', done: false },
                ].map((e, i) => (
                  <div key={i} className={`chk-item${e.done ? ' done' : ''}`}>
                    <div className="chk-box">{e.done ? '✓' : ''}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, flex: 1 }}>{e.path}</div>
                    <div className={`chk-tag${!e.done ? ' pending' : ''}`}>{e.done ? 'Activo' : 'En dev.'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="📄 Resumen Comité — SOL-2024-089"
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancelar</button><button className="btn btn-outline">📊 Excel</button><button className="btn btn-primary">📄 Exportar PDF</button></>}>
        <div style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-100)', borderRadius: 10, padding: 18, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-900)', marginBottom: 2 }}>BANCO DE DESARROLLO PRODUCTIVO S.A.M.</div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 16 }}>Resumen Ejecutivo — Comité de Crédito</div>
          <div className="g2" style={{ gap: 10, fontSize: 13, marginBottom: 14 }}>
            <div><span style={{ color: 'var(--text-muted)' }}>Solicitante:</span><br /><b>Agropecuaria El Ceibo S.R.L.</b></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Monto:</span><br /><b style={{ fontFamily: "'IBM Plex Mono',monospace" }}>Bs. 850.000,00</b></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Score de Riesgo:</span><br /><b style={{ color: 'var(--yellow)' }}>724 — Moderado</b></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Cobertura Garantía:</span><br /><b style={{ color: 'var(--green)' }}>257%</b></div>
          </div>
          <div className="alert a-success" style={{ marginBottom: 0 }}><div className="alert-ico">✅</div><div className="alert-text"><strong>Recomendación:</strong> APROBAR.</div></div>
        </div>
      </Modal>
      <DevTaskPanel vista="Reportes" />
    </div>
  );
}
