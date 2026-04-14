// frontend/src/modules/creditos/RiesgoView.jsx
export default function RiesgoView() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Calificación de Riesgo Automatizada</div>
          <div className="page-sub">RF-09 · Score automático con variables financieras y sectoriales</div>
        </div>
      </div>
      <div className="g12">
        <div className="card">
          <div className="card-header"><div className="card-title">Desglose por Variable</div></div>
          <div className="card-body">
            <div className="bar-rows">
              <div className="br-row"><div className="br-lbl">Financiero</div><div className="br-track"><div className="br-fill" style={{ width: '80%', background: 'linear-gradient(90deg,#059669,#10B981)' }}></div></div><div className="br-val" style={{ color: 'var(--green)' }}>80/100</div></div>
              <div className="br-row"><div className="br-lbl">Historial CC</div><div className="br-track"><div className="br-fill" style={{ width: '90%', background: 'linear-gradient(90deg,#059669,#10B981)' }}></div></div><div className="br-val" style={{ color: 'var(--green)' }}>90/100</div></div>
              <div className="br-row"><div className="br-lbl">Sectorial</div><div className="br-track"><div className="br-fill" style={{ width: '65%', background: 'linear-gradient(90deg,var(--yellow),#F59E0B)' }}></div></div><div className="br-val" style={{ color: 'var(--yellow)' }}>65/100</div></div>
              <div className="br-row"><div className="br-lbl">Garantías</div><div className="br-track"><div className="br-fill" style={{ width: '75%', background: 'linear-gradient(90deg,#059669,#10B981)' }}></div></div><div className="br-val" style={{ color: 'var(--green)' }}>75/100</div></div>
              <div className="br-row"><div className="br-lbl">Clima/Entorno</div><div className="br-track"><div className="br-fill" style={{ width: '50%', background: 'linear-gradient(90deg,var(--yellow),#EF4444)' }}></div></div><div className="br-val" style={{ color: 'var(--yellow)' }}>50/100</div></div>
            </div>
            <div className="alert a-warn mt16"><div className="alert-ico">🌦</div><div className="alert-text"><strong>Alerta climática:</strong> El historial de sequías en la zona reduce el score sectorial. Se recomienda revisar cobertura de garantías.</div></div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Score Global</div></div>
          <div className="card-body">
            <div className="risk-gauge">
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--text-muted)', marginBottom: 8 }}>Puntuación Automática</div>
              <div className="risk-score-num" style={{ color: 'var(--yellow)' }}>724</div>
              <div className="risk-score-lbl" style={{ color: 'var(--yellow)' }}>Riesgo Moderado</div>
              <div style={{ width: '100%', marginTop: 16 }}>
                <div className="risk-track"><div className="risk-cursor" style={{ left: '72%' }}></div></div>
                <div className="risk-ticks"><span style={{ color: 'var(--green)' }}>Bajo</span><span style={{ color: 'var(--text-muted)' }}>Moderado</span><span style={{ color: 'var(--red)' }}>Alto</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
