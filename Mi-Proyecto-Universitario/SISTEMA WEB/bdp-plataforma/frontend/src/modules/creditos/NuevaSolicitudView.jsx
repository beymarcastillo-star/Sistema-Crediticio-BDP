// frontend/src/modules/creditos/NuevaSolicitudView.jsx
// ============================================================
// TAREAS PENDIENTES — NuevaSolicitudView.jsx
// ── P1 🔵 Roger · HU-04 (Carga de Documentos) ───────────────
// TODO (P1 · Roger · HU-04): Dropzone: lista de archivos con nombre, tamaño e ícono por tipo
// TODO (P1 · Roger · HU-04): Botón "✕ Eliminar" en cada archivo cargado
// TODO (P1 · Roger · HU-04): Barra de progreso simulada al subir (setTimeout)
// TODO (P1 · Roger · HU-04): Error visual si archivo supera 25MB o tipo no permitido
// ── P1 🔵 Roger · HU-07 (Evaluación Productiva) ─────────────
// TODO (P1 · Roger · HU-07): Campos dinámicos sector Pecuario: especie, cabezas, natalidad, precio/kg
// TODO (P1 · Roger · HU-07): Campos dinámicos sector Industrial: capacidad, unidades/mes, costo MP
// TODO (P1 · Roger · HU-07): Campos dinámicos sector Transporte: vehículos, rutas, carga, tarifa/km
// TODO (P1 · Roger · HU-07): Campos dinámicos sector Comercio: tipo, inventario promedio, rotación
// TODO (P1 · Roger · HU-07): Campos dinámicos sector Energía: fuente, capacidad MW, precio/kWh
// ── P2 🟣 Beymar · HU-05 (Validación Documental) ────────────
// TODO (P2 · Beymar · HU-05): UI Paso 3 — Documentación: checklist con checkbox y progreso "X de 8"
// TODO (P2 · Beymar · HU-05): UI Paso 4 — Evaluación: resumen solo lectura + textarea observaciones
// TODO (P2 · Beymar · HU-05): UI Paso 5 — Comité: resumen ejecutivo + botones Aprobar/Observar/Rechazar
// TODO (P2 · Beymar · HU-05): Botón "Enviar a Evaluación" visible, deshabilitado hasta completar docs
// TODO (P2 · Beymar · HU-05): Botón "Guardar borrador" en todos los pasos
// ============================================================
import { useState } from 'react';
import DevTaskPanel from '../../components/DevTaskPanel.jsx';

const sectores = [
  { emoji: '🌾', name: 'Agrícola', desc: 'Soya, papa, quinua' },
  { emoji: '🐄', name: 'Pecuario', desc: 'Ganado, hato' },
  { emoji: '🏭', name: 'Industrial', desc: 'Manufactura' },
  { emoji: '🚛', name: 'Transporte', desc: 'Flota vehicular' },
  { emoji: '🏪', name: 'Comercio', desc: 'Pyme comercial' },
  { emoji: '⚡', name: 'Energía', desc: 'Renovables' },
];

export default function NuevaSolicitudView() {
  const [sectorSel, setSectorSel] = useState(0);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Nueva Solicitud de Crédito</div>
          <div className="page-sub">RF-02 · Registro único · datos se propagan automáticamente</div>
        </div>
      </div>

      {/* WIZARD */}
      <div className="wizard">
        <div className="wstep done"><div className="wstep-circle">✓</div><div className="wstep-label"><div className="wstep-num">Paso 1</div><div className="wstep-name">Perfil &amp; Sector</div></div></div>
        <div className="wstep-line"></div>
        <div className="wstep active"><div className="wstep-circle">2</div><div className="wstep-label"><div className="wstep-num">Paso 2</div><div className="wstep-name">Datos del Cliente</div></div></div>
        <div className="wstep-line"></div>
        <div className="wstep"><div className="wstep-circle">3</div><div className="wstep-label"><div className="wstep-num">Paso 3</div><div className="wstep-name">Documentación</div></div></div>
        <div className="wstep-line"></div>
        <div className="wstep"><div className="wstep-circle">4</div><div className="wstep-label"><div className="wstep-num">Paso 4</div><div className="wstep-name">Evaluación</div></div></div>
        <div className="wstep-line"></div>
        <div className="wstep"><div className="wstep-circle">5</div><div className="wstep-label"><div className="wstep-num">Paso 5</div><div className="wstep-name">Comité</div></div></div>
      </div>

      <div className="g2 mb20">
        {/* SECTOR */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🎯 Tipo de Evaluación</div>
            <span className="badge b-blue">Campos dinámicos</span>
          </div>
          <div className="card-body">
            <div className="alert a-info mb20">
              <div className="alert-ico">ℹ</div>
              <div className="alert-text">Al seleccionar el sector, el formulario mostrará campos específicos. <strong>Agrícola</strong> activa simulador de sequías; <strong>Pecuario</strong> activa proyección de hato ganadero.</div>
            </div>
            <div className="sector-grid">
              {sectores.map((s, i) => (
                <div key={i} className={`sector-btn${sectorSel === i ? ' sel' : ''}`} onClick={() => setSectorSel(i)}>
                  <span className="sector-emoji">{s.emoji}</span>
                  <div className="sector-name">{s.name}</div>
                  <div className="sector-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DATOS CLIENTE */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">👤 Datos del Solicitante</div>
            <span className="badge b-green">Datos únicos reutilizables</span>
          </div>
          <div className="card-body">
            <div className="form-row cols-2">
              <div className="form-group"><label className="lbl">Razón Social <span className="req">*</span></label><input className="inp" defaultValue="Agropecuaria El Ceibo S.R.L." /></div>
              <div className="form-group"><label className="lbl">NIT <span className="req">*</span></label><input className="inp" defaultValue="1023450012" style={{ fontFamily: "'IBM Plex Mono',monospace" }} /></div>
            </div>
            <div className="form-row cols-3">
              <div className="form-group"><label className="lbl">Tipo <span className="req">*</span></label><select className="sel"><option>Pyme</option><option>Banca Empresa</option></select></div>
              <div className="form-group"><label className="lbl">Departamento <span className="req">*</span></label><select className="sel"><option>Santa Cruz</option><option>Beni</option><option>La Paz</option><option>Oruro</option><option>Cochabamba</option></select></div>
              <div className="form-group"><label className="lbl">Plazo (meses)</label><input className="inp" defaultValue="60" /></div>
            </div>
            <div className="form-row cols-2">
              <div className="form-group"><label className="lbl">Monto Solicitado (Bs.) <span className="req">*</span></label><input className="inp" defaultValue="850,000.00" style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }} /></div>
              <div className="form-group"><label className="lbl">Tasa de Interés (%)</label><input className="inp" defaultValue="6.5" style={{ fontFamily: "'IBM Plex Mono',monospace" }} /></div>
            </div>
            {sectorSel === 0 && (
              <>
                <hr className="divider" />
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--blue-700)', marginBottom: 12 }}>🌾 Datos Sector Agrícola</div>
                <div className="form-row cols-2">
                  <div className="form-group"><label className="lbl">Cultivo Principal</label><select className="sel"><option>Soya</option><option>Papa</option><option>Quinua</option><option>Maíz</option></select></div>
                  <div className="form-group"><label className="lbl">Hectáreas</label><input className="inp" defaultValue="250" style={{ fontFamily: "'IBM Plex Mono',monospace" }} /></div>
                </div>
                <div className="form-row cols-2">
                  <div className="form-group"><label className="lbl">Rendimiento (qq/ha)</label><input className="inp" defaultValue="45" style={{ fontFamily: "'IBM Plex Mono',monospace" }} /></div>
                  <div className="form-group"><label className="lbl">Precio por Quintal (Bs.)</label><input className="inp" defaultValue="280" style={{ fontFamily: "'IBM Plex Mono',monospace" }} /></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* DOCUMENTACIÓN + DRAG & DROP */}
      <div className="g2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">📎 Checklist de Documentación</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="badge b-red">3 pendientes</span>
              <span className="badge b-green">5 listos</span>
            </div>
          </div>
          <div className="card-body">
            <div className="checklist">
              {[
                { label: 'Carnet de Identidad / Pasaporte', done: true, star: true },
                { label: 'NIT / Matrícula de Comercio', done: true, star: true },
                { label: 'Balance General último año', done: true },
                { label: 'Estado de Resultados', done: true },
                { label: 'Títulos de Propiedad / Garantía', done: true },
                { label: 'Plan de Inversión / Negocio', done: false, star: true },
                { label: 'Declaración Patrimonial Jurada', done: false, star: true },
              ].map((item, i) => (
                <div key={i} className={`chk-item${item.done ? ' done' : ''}`}>
                  <div className="chk-box">{item.done ? '✓' : ''}</div>
                  <div style={{ flex: 1 }}>{item.label} {item.star && <span style={{ color: 'var(--orange)' }}>★</span>}</div>
                  <div className={`chk-tag${!item.done ? ' pending' : ''}`}>{item.done ? 'Completo' : 'Pendiente'}</div>
                </div>
              ))}
              <div className="chk-item locked"><div className="chk-box">🔒</div><div style={{ flex: 1 }}>Declaración Jurada No Vinculación</div><div className="chk-tag">Bloqueado</div></div>
            </div>
            <div className="lock-notice">🔒 <strong>El botón "Enviar a Evaluación" está bloqueado</strong> hasta completar todos los documentos obligatorios (★).</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">📤 Cargar Documentos</div>
            <span className="badge b-gray">RF-08 · Cifrado AES-256</span>
          </div>
          <div className="card-body">
            <div className="dropzone">
              <div className="drop-icon">📁</div>
              <div className="drop-title">Arrastra archivos aquí o haz clic</div>
              <div className="drop-sub">PDF, JPG, PNG, XLSX · Máx. 25 MB · Almacenamiento cifrado</div>
            </div>
            <div className="file-list">
              <div className="file-item"><div className="file-ico">📄</div><div className="file-info"><div className="file-name">Balance_General_2023.pdf</div><div className="file-size">2.4 MB · 15/06/2024</div></div><div className="file-ok">✓ Verificado</div></div>
              <div className="file-item"><div className="file-ico">📊</div><div className="file-info"><div className="file-name">Estado_Resultados_2023.xlsx</div><div className="file-size">890 KB · 15/06/2024</div></div><div className="file-ok">✓ Verificado</div></div>
            </div>
          </div>
        </div>
      </div>
      <DevTaskPanel vista="NuevaSolicitud" />
    </div>
  );
}
