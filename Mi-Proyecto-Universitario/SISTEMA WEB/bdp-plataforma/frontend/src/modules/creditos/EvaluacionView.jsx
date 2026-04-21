// frontend/src/modules/creditos/EvaluacionView.jsx
// ============================================================
// TAREAS PENDIENTES — EvaluacionView.jsx
// ── P3 🟠 Norma · HU-06 (Evaluación Financiera) ─────────────
// TODO (P3 · Norma · HU-06): Pestaña Proyecciones: instalar recharts, gráfico barras agrupadas 5 años
// TODO (P3 · Norma · HU-06): Pestaña Flujo de Caja: agregar gráfico de líneas mensual (12 meses mock)
// TODO (P3 · Norma · HU-06): Selector escenario global: Optimista / Base / Pesimista
// TODO (P3 · Norma · HU-06): Botones Excel/PDF del modal Resumen Comité con spinner de carga
// ============================================================
import { useState } from 'react';
import Modal from '../../components/Modal.jsx';
import DevTaskPanel from '../../components/DevTaskPanel.jsx';

export default function EvaluacionView() {
  const [tab, setTab] = useState('flujo');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Evaluación Financiera Automatizada</div>
          <div className="page-sub">RF-03 · Flujo de caja, balance, proyecciones e índices financieros</div>
        </div>
        <div className="actions">
          <button className="btn btn-outline btn-sm" onClick={() => setModalOpen(true)}>📄 Resumen Comité</button>
          <button className="btn btn-primary btn-sm">💾 Guardar</button>
        </div>
      </div>

      <div className="tabs">
        {[['flujo','💧 Flujo de Caja'],['balance','⚖ Balance General'],['proyecciones','📈 Proyecciones'],['indices','🔢 Índices']].map(([key, label]) => (
          <div key={key} className={`tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>{label}</div>
        ))}
      </div>

      {tab === 'flujo' && (
        <div className="g2">
          <div className="card">
            <div className="card-header"><div className="card-title">📊 Flujo de Caja Proyectado vs. Real</div><span className="badge b-green">Calculado automáticamente</span></div>
            <div className="card-body">
              <div className="info-box mb20"><strong>Sector Agrícola — Soya, Santa Cruz:</strong> Los ingresos se proyectan según el ciclo de siembra/cosecha y los supuestos de precio.</div>
              <div className="alert a-success mt16"><div className="alert-ico">✅</div><div className="alert-text"><strong>Capacidad de pago confirmada:</strong> El flujo neto cubre el servicio de deuda con un margen del 312%. Crédito viable.</div></div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">⚙ Supuestos del Escenario</div><span className="badge b-yellow">Motor de reglas RNF-03</span></div>
            <div className="card-body">
              <div className="info-box mb20">Modifique los supuestos para ver cómo cambian los resultados <strong>instantáneamente</strong>.</div>
              <div className="supuesto-grid">
                <div className="supuesto-card"><div className="sup-label">Precio Quintal Soya (Bs.)</div><input className="sup-input" defaultValue="280" /><div className="sup-hint">Precio mercado: Bs. 295</div></div>
                <div className="supuesto-card"><div className="sup-label">Rendimiento por Ha (qq)</div><input className="sup-input" defaultValue="45" /><div className="sup-hint">Promedio zona: 48 qq/ha</div></div>
                <div className="supuesto-card"><div className="sup-label">Escenario Climático</div><select className="sup-input"><option>Normal (100%)</option><option>Sequía leve (-15%)</option><option>Sequía moderada (-30%)</option><option>Sequía severa (-50%)</option></select></div>
                <div className="supuesto-card"><div className="sup-label">Tasa de Interés (%)</div><input className="sup-input" defaultValue="6.5" /><div className="sup-hint">Tasa BDP vigente</div></div>
              </div>
              <div className="result-box">
                <div className="result-row"><span>Ingresos ajustados</span><span className="result-val warn">Bs. 1.323.000</span></div>
                <div className="result-row"><span>Costos totales</span><span className="result-val bad">(Bs. 815.000)</span></div>
                <div className="result-row"><span>Cobertura deuda</span><span className="result-val good">218%</span></div>
                <div className="result-row"><span style={{ fontWeight: 700 }}>Viabilidad</span><span className="badge b-yellow">⚠ Viable con ajuste</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'balance' && (
        <div className="g2">
          <div className="card"><div className="card-header"><div className="card-title">Activos</div></div><div className="card-body p0"><table><thead><tr><th>Cuenta</th><th>Bs.</th><th>%</th></tr></thead><tbody><tr><td>Activo Corriente</td><td style={{ fontFamily: "'IBM Plex Mono',monospace" }}>320.000</td><td><span className="badge b-blue">9%</span></td></tr><tr><td>Inventarios</td><td style={{ fontFamily: "'IBM Plex Mono',monospace" }}>180.000</td><td><span className="badge b-blue">5%</span></td></tr><tr><td>Activo Fijo</td><td style={{ fontFamily: "'IBM Plex Mono',monospace" }}>1.850.000</td><td><span className="badge b-orange">52%</span></td></tr><tr><td style={{ fontWeight: 700 }}>TOTAL ACTIVOS</td><td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: 'var(--blue-800)' }}>3.550.000</td><td></td></tr></tbody></table></div></div>
          <div className="card"><div className="card-header"><div className="card-title">Pasivos &amp; Patrimonio</div></div><div className="card-body p0"><table><thead><tr><th>Cuenta</th><th>Bs.</th><th>%</th></tr></thead><tbody><tr><td>Pasivo Corriente</td><td style={{ fontFamily: "'IBM Plex Mono',monospace" }}>145.000</td><td><span className="badge b-red">4%</span></td></tr><tr><td>Deuda Largo Plazo</td><td style={{ fontFamily: "'IBM Plex Mono',monospace" }}>850.000</td><td><span className="badge b-yellow">24%</span></td></tr><tr><td>Patrimonio Neto</td><td style={{ fontFamily: "'IBM Plex Mono',monospace" }}>2.555.000</td><td><span className="badge b-green">72%</span></td></tr><tr><td style={{ fontWeight: 700 }}>TOTAL PAS. + PAT.</td><td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: 'var(--blue-800)' }}>3.550.000</td><td></td></tr></tbody></table></div></div>
        </div>
      )}

      {tab === 'proyecciones' && (
        <div className="card"><div className="card-header"><div className="card-title">📈 Proyección de Ingresos — 5 Años</div><span className="badge b-green">Calculado automáticamente</span></div><div className="card-body"><p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Gráfico de proyecciones — implementar con tus compañeros</p></div></div>
      )}

      {tab === 'indices' && (
        <div className="g3">
          <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: 28 }}><div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--text-muted)', marginBottom: 10 }}>Liquidez Corriente</div><div style={{ fontSize: 40, fontWeight: 800, color: 'var(--green)' }}>2.21</div><div className="badge b-green" style={{ margin: '10px auto', display: 'inline-flex' }}>✓ Óptimo &gt; 1.5</div></div></div>
          <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: 28 }}><div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--text-muted)', marginBottom: 10 }}>Endeudamiento</div><div style={{ fontSize: 40, fontWeight: 800, color: 'var(--yellow)' }}>0.39</div><div className="badge b-yellow" style={{ margin: '10px auto', display: 'inline-flex' }}>⚠ Moderado &lt; 0.6</div></div></div>
          <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: 28 }}><div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--text-muted)', marginBottom: 10 }}>Rentabilidad ROE</div><div style={{ fontSize: 40, fontWeight: 800, color: 'var(--green)' }}>18.4%</div><div className="badge b-green" style={{ margin: '10px auto', display: 'inline-flex' }}>✓ Rentable &gt; 12%</div></div></div>
        </div>
      )}

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
          <div className="alert a-success" style={{ marginBottom: 0 }}><div className="alert-ico">✅</div><div className="alert-text"><strong>Recomendación:</strong> APROBAR. El flujo cubre la deuda incluso en escenario de sequía moderada (-30%).</div></div>
        </div>
        <div className="info-box"><strong>RF-05:</strong> Este reporte se genera automáticamente. Exportable en PDF o Excel.</div>
      </Modal>
      <DevTaskPanel vista="Evaluacion" />
    </div>
  );
}
