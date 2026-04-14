// frontend/src/modules/creditos/SolicitudesView.jsx
export default function SolicitudesView({ onNavigate }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Gestión de Solicitudes</div>
          <div className="page-sub">RF-02 · Pyme &amp; Banca Empresa</div>
        </div>
        <div className="actions">
          <button className="btn btn-outline btn-sm">📊 Excel</button>
          <button className="btn btn-outline btn-sm">📄 PDF</button>
          <button className="btn btn-primary" onClick={() => onNavigate('nueva')}>➕ Nueva</button>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input className="inp" placeholder="🔍 Buscar por NIT, nombre, ID..." style={{ width: 260, padding: '8px 12px' }} />
            <select className="sel" style={{ width: 150, padding: '8px 10px' }}>
              <option>Todos los estados</option>
              <option>En Análisis</option>
              <option>En Comité</option>
              <option>Aprobado</option>
              <option>Observado</option>
            </select>
            <select className="sel" style={{ width: 140, padding: '8px 10px' }}>
              <option>Todos sectores</option>
              <option>Agrícola</option>
              <option>Pecuario</option>
              <option>Industrial</option>
            </select>
          </div>
        </div>
        <div className="card-body p0">
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>Nro.</th><th>Solicitante</th><th>Tipo</th><th>Sector</th><th>Monto Bs.</th><th>Analista</th><th>Estado</th><th>Riesgo</th><th>Fecha</th><th>Acción</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--blue-600)', fontWeight: 700 }}>089</td>
                  <td><b>Agropecuaria El Ceibo</b><br /><small style={{ color: 'var(--text-muted)' }}>NIT: 1023450012</small></td>
                  <td><span className="badge b-blue">Pyme</span></td>
                  <td>🌾 Agrícola</td>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>850.000</td>
                  <td>M. Ávila</td>
                  <td><span className="badge b-yellow">⏳ Análisis</span></td>
                  <td><span className="badge b-yellow">Moderado</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>15/06/24</td>
                  <td><button className="btn btn-outline btn-sm" onClick={() => onNavigate('financiero')}>Evaluar</button></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--blue-600)', fontWeight: 700 }}>088</td>
                  <td><b>Ganadería Los Andes</b><br /><small style={{ color: 'var(--text-muted)' }}>NIT: 4056780023</small></td>
                  <td><span className="badge b-orange">BE</span></td>
                  <td>🐄 Pecuario</td>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>1.200.000</td>
                  <td>R. Flores</td>
                  <td><span className="badge b-green">✓ Aprobado</span></td>
                  <td><span className="badge b-green">Bajo</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>12/06/24</td>
                  <td><button className="btn btn-outline btn-sm">Detalle</button></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--blue-600)', fontWeight: 700 }}>087</td>
                  <td><b>TecnoAlimentos Ltda.</b><br /><small style={{ color: 'var(--text-muted)' }}>NIT: 8901230034</small></td>
                  <td><span className="badge b-blue">Pyme</span></td>
                  <td>🏭 Industrial</td>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>450.000</td>
                  <td>M. Ávila</td>
                  <td><span className="badge b-blue">📤 Comité</span></td>
                  <td><span className="badge b-yellow">Moderado</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>10/06/24</td>
                  <td><button className="btn btn-outline btn-sm">Detalle</button></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--blue-600)', fontWeight: 700 }}>086</td>
                  <td><b>Coop. Papa Altiplano</b><br /><small style={{ color: 'var(--text-muted)' }}>NIT: 2345670045</small></td>
                  <td><span className="badge b-blue">Pyme</span></td>
                  <td>🥔 Agrícola</td>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>320.000</td>
                  <td>C. Mamani</td>
                  <td><span className="badge b-red">✗ Observado</span></td>
                  <td><span className="badge b-red">Alto</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>08/06/24</td>
                  <td><button className="btn btn-outline btn-sm">Revisar</button></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--blue-600)', fontWeight: 700 }}>085</td>
                  <td><b>Transportes del Sur</b><br /><small style={{ color: 'var(--text-muted)' }}>NIT: 7891230056</small></td>
                  <td><span className="badge b-orange">BE</span></td>
                  <td>🚛 Transporte</td>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>680.000</td>
                  <td>R. Flores</td>
                  <td><span className="badge b-green">⚙ Desembolso</span></td>
                  <td><span className="badge b-green">Bajo</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>05/06/24</td>
                  <td><button className="btn btn-outline btn-sm">Ver</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
