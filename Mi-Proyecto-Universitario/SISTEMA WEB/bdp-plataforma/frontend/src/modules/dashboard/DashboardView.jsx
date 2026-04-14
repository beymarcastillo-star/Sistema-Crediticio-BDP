// frontend/src/modules/dashboard/DashboardView.jsx
import StatCard from '../../components/StatCard.jsx';

export default function DashboardView({ onNavigate }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Centro de control · Pyme &amp; Banca Empresa · Actualizado hace 2 min</div>
        </div>
        <div className="actions">
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('reportes')}>📑 Exportar</button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('nueva')}>➕ Nueva Solicitud</button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="stat-grid">
        <StatCard icon="📋" label="Solicitudes Activas" value="47" change="▲ +8% vs mes anterior" changeType="up" accent="var(--blue-600)" />
        <StatCard icon="💰" label="Cartera Aprobada" value="Bs 12.4M" change="▲ Cartera sana 94.2%" changeType="up" accent="#059669" />
        <StatCard icon="⏱" label="Tiempo Prom. Aprobación" value="3.2d" change="▲ Antes 15–21 días" changeType="up" accent="var(--orange)" />
        <StatCard icon="⚠" label="Pendientes Comité" value="7" change="● 2 requieren atención" changeType="down" accent="var(--yellow)" />
      </div>

      <div className="g21 mb20">
        {/* TABLA SOLICITUDES RECIENTES */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Solicitudes Recientes</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input className="inp" placeholder="🔍 Buscar NIT / nombre..." style={{ width: 200, padding: '7px 12px' }} />
              <select className="sel" style={{ width: 140, padding: '7px 10px' }}>
                <option>Todos los estados</option>
                <option>En Análisis</option>
                <option>Aprobado</option>
                <option>Observado</option>
              </select>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('solicitudes')}>Ver todas →</button>
            </div>
          </div>
          <div className="card-body p0">
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr><th>ID</th><th>Cliente</th><th>Sector</th><th>Monto Bs.</th><th>Estado</th><th>Acción</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--blue-600)', fontWeight: 600 }}>SOL-089</td>
                    <td><b>Agropecuaria El Ceibo</b><br /><small style={{ color: 'var(--text-muted)' }}>Santa Cruz</small></td>
                    <td>🌾 Agrícola</td>
                    <td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600 }}>850.000</td>
                    <td><span className="badge b-yellow">⏳ En Análisis</span></td>
                    <td><button className="btn btn-outline btn-sm" onClick={() => onNavigate('financiero')}>Evaluar</button></td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--blue-600)', fontWeight: 600 }}>SOL-088</td>
                    <td><b>Ganadería Los Andes</b><br /><small style={{ color: 'var(--text-muted)' }}>Beni</small></td>
                    <td>🐄 Pecuario</td>
                    <td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600 }}>1.200.000</td>
                    <td><span className="badge b-green">✓ Aprobado</span></td>
                    <td><button className="btn btn-outline btn-sm">Ver</button></td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--blue-600)', fontWeight: 600 }}>SOL-087</td>
                    <td><b>TecnoAlimentos Ltda.</b><br /><small style={{ color: 'var(--text-muted)' }}>La Paz</small></td>
                    <td>🏭 Industrial</td>
                    <td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600 }}>450.000</td>
                    <td><span className="badge b-blue">📤 En Comité</span></td>
                    <td><button className="btn btn-outline btn-sm">Ver</button></td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--blue-600)', fontWeight: 600 }}>SOL-086</td>
                    <td><b>Coop. Papa Altiplano</b><br /><small style={{ color: 'var(--text-muted)' }}>Oruro</small></td>
                    <td>🥔 Agrícola</td>
                    <td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600 }}>320.000</td>
                    <td><span className="badge b-red">✗ Observado</span></td>
                    <td><button className="btn btn-outline btn-sm">Revisar</button></td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--blue-600)', fontWeight: 600 }}>SOL-085</td>
                    <td><b>Transportes del Sur</b><br /><small style={{ color: 'var(--text-muted)' }}>Tarija</small></td>
                    <td>🚛 Transporte</td>
                    <td style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600 }}>680.000</td>
                    <td><span className="badge b-green">⚙ Desembolso</span></td>
                    <td><button className="btn btn-outline btn-sm">Ver</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SIDE CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Por Sector</div></div>
            <div className="card-body">
              <div className="bar-rows">
                <div className="br-row"><div className="br-lbl">Agrícola</div><div className="br-track"><div className="br-fill" style={{ width: '72%', background: 'linear-gradient(90deg,var(--blue-600),var(--blue-500))' }}></div></div><div className="br-val" style={{ color: 'var(--blue-600)' }}>72%</div></div>
                <div className="br-row"><div className="br-lbl">Pecuario</div><div className="br-track"><div className="br-fill" style={{ width: '55%', background: 'linear-gradient(90deg,#059669,#10B981)' }}></div></div><div className="br-val" style={{ color: 'var(--green)' }}>55%</div></div>
                <div className="br-row"><div className="br-lbl">Industrial</div><div className="br-track"><div className="br-fill" style={{ width: '38%', background: 'linear-gradient(90deg,#7C3AED,#8B5CF6)' }}></div></div><div className="br-val" style={{ color: '#7C3AED' }}>38%</div></div>
                <div className="br-row"><div className="br-lbl">Transporte</div><div className="br-track"><div className="br-fill" style={{ width: '22%', background: 'linear-gradient(90deg,var(--orange),#F59E0B)' }}></div></div><div className="br-val" style={{ color: 'var(--orange)' }}>22%</div></div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Estado Sistema</div></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>API CORE Bancario</span><span className="badge b-green">● Online</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Base de Datos</span><span className="badge b-green">● Activo</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Usuarios activos</span><span className="badge b-blue">38 / 500</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Logs Auditoría</span><span className="badge b-green">● Inmutable</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
