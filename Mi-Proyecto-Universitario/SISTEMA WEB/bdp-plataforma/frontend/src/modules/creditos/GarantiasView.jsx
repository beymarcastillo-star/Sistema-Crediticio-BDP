// frontend/src/modules/creditos/GarantiasView.jsx
import { useState } from 'react';
import Modal from '../../components/Modal.jsx';

export default function GarantiasView() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Gestión de Garantías</div>
          <div className="page-sub">Conexión dinámica entre valor de garantía y capacidad de pago real</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>➕ Nueva Garantía</button>
      </div>

      <div className="g21">
        <div className="card">
          <div className="card-header"><div className="card-title">Garantías Registradas</div></div>
          <div className="card-body p0">
            <table>
              <thead><tr><th>Tipo</th><th>Descripción</th><th>Valor Bs.</th><th>Cobertura</th><th>Estado</th></tr></thead>
              <tbody>
                <tr>
                  <td>🏗 Hipotecaria</td>
                  <td><b>Predio "El Ceibo" — 250 has</b><br /><small style={{ color: 'var(--text-muted)' }}>Santa Cruz, Warnes</small></td>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace" }}>1.800.000</td>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--green)', fontWeight: 700 }}>212%</td>
                  <td><span className="badge b-green">Vigente</span></td>
                </tr>
                <tr>
                  <td>🚜 Prendaria</td>
                  <td><b>Cosechadora John Deere S680</b><br /><small style={{ color: 'var(--text-muted)' }}>Año 2022, VIN: JD22-4590</small></td>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace" }}>380.000</td>
                  <td style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--green)', fontWeight: 700 }}>45%</td>
                  <td><span className="badge b-green">Vigente</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Cobertura Total</div></div>
          <div className="card-body">
            <div className="coverage-big">
              <div className="coverage-num">257%</div>
              <div className="coverage-lbl">Cobertura sobre crédito solicitado</div>
              <div className="badge b-green" style={{ margin: '10px auto', display: 'inline-flex' }}>✓ Óptima &gt; 150%</div>
            </div>
            <div className="info-box">El valor de las garantías se actualiza automáticamente con datos del avalúo.</div>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="🏠 Nueva Garantía"
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancelar</button><button className="btn btn-primary">Registrar Garantía</button></>}>
        <div className="form-row">
          <div className="form-group"><label className="lbl">Tipo de Garantía <span className="req">*</span></label><select className="sel"><option>Hipotecaria</option><option>Prendaria</option><option>Personal</option><option>Mixta</option></select></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="lbl">Descripción</label><textarea className="txta" rows="3" placeholder="Descripción del bien en garantía..." /></div>
        </div>
        <div className="form-row cols-2">
          <div className="form-group"><label className="lbl">Valor Avalúo (Bs.) <span className="req">*</span></label><input className="inp" placeholder="0.00" style={{ fontFamily: "'IBM Plex Mono',monospace" }} /></div>
          <div className="form-group"><label className="lbl">Fecha Avalúo</label><input className="inp" type="date" /></div>
        </div>
      </Modal>
    </div>
  );
}
